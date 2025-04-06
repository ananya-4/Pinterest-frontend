import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ProfileEdit = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    avatar: user.avatar || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setFormData({
        ...formData,
        avatar: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'avatar') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await fetch(`/api/users/profile`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        onUpdate(data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <input
          accept="image/*"
          type="file"
          id="avatar-upload"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="avatar-upload">
          <Avatar
            src={formData.avatar}
            sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto',
              cursor: 'pointer'
            }}
          />
          <IconButton 
            color="primary" 
            component="span"
            sx={{ 
              position: 'relative', 
              top: -40, 
              backgroundColor: 'white' 
            }}
          >
            <PhotoCamera />
          </IconButton>
        </label>
      </Box>

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileEdit;