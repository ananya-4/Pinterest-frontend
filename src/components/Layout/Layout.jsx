import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import useAuth from '../../context/AuthContext';  // Changed from named to default import
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate(`/${user.name}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <Box>
      <Navbar handleProfileClick={handleProfileClick} />
      <Box component="main" sx={{ p: 3, mt: 10 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;