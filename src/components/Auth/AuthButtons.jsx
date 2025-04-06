import React from 'react';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthButtons = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Stack direction="row" spacing={2}>
      {!user ? (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ borderRadius: '20px' }}
          >
            Log in
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/register')}
            sx={{ borderRadius: '20px' }}
          >
            Sign up
          </Button>
        </>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleLogout}
          sx={{ borderRadius: '20px' }}
        >
          Logout
        </Button>
      )}
    </Stack>
  );
};

export default AuthButtons;