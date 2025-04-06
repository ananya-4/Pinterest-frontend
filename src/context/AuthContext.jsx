import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData) => {
    if (!userData) {
      console.error('Invalid login data:', userData);
      return;
    }
    try {
      // Handle both registration and login response structures
      const token = userData.token;
      const userInfo = userData.user || userData; // Handle both nested and flat structures
      
      const userToStore = {
        _id: userInfo._id,
        username: userInfo.username || userInfo.name, // Handle both username and name
        name: userInfo.name || userInfo.username, // Use either name or username
        email: userInfo.email,
        profilePicture: userInfo.profilePicture || '',
        bio: userInfo.bio || ''
      };
      
      console.log('Processing login data:', { token, user: userToStore });

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
      console.log('Login successful:', userToStore);
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default useAuth;