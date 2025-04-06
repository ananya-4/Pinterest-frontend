import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/AuthContext'; // Changed from named to default import
import api from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',     // Changed from username to name
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.name.toLowerCase().replace(/\s+/g, '')
      };
      
      const { data } = await api.post('/auth/register', userData);
      if (data) {
        login(data);
        navigate('/');
      }
    } catch (error) {
      console.error('Full error details:', error.response?.data || error);
      if (error.response?.data?.error?.includes('duplicate key error')) {
        setError('Username already exists. Please choose a different name.');
      } else {
        setError(error.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"           // Changed from username to name
            label="Name"        // Changed label
            name="name"         // Changed from username to name
            autoComplete="name" // Changed from username to name
            autoFocus
            value={formData.name}  // Changed from username to name
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;