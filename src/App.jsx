import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import CreatePin from './components/CreatePin/CreatePin';
import PinGrid from './components/PinGrid/PinGrid';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { getPins } from './services/pinService';
import Profile from './components/Profile/Profile';
import { useLocation } from 'react-router-dom';
import useAuth from './context/AuthContext';
import SearchResults from './components/SearchResults/SearchResults';

function App() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const data = await getPins();
        setPins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/create" element={
              <PrivateRoute>
                <CreatePin />
              </PrivateRoute>
            } />
            <Route path="/profile/:username" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/" element={<PinGrid pins={pins} loading={loading} error={error} />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

// Add these components at the top of App.jsx
const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  return children;
};

export default App;
