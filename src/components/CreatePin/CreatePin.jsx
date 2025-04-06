import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createPin } from '../../services/pinService';

const categories = [
  'Art',
  'Photography',
  'Food',
  'Travel',
  'Fashion',
  'Technology',
  'DIY',
  'Other'
];

const CreatePin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    link: ''
  });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setFormData({
        ...formData,
        image: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log('Submitting pin data:', Object.fromEntries(formDataToSend));
      const response = await createPin(formDataToSend);
      console.log('Pin creation response:', response);
      navigate('/');
    } catch (error) {
      console.error('Pin creation error:', error);
      setError(error.message || 'Failed to create pin');
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
          Create New Pin
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            name="link"
            label="Source Link (optional)"
            value={formData.link}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!formData.image || !formData.title || !formData.category}
          >
            Create Pin
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreatePin;