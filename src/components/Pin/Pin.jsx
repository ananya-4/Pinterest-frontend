import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { API_URL } from '../../config';

const Pin = ({ image, title }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    
    // Clean up the path and remove any duplicate 'uploads'
    const cleanPath = imagePath.replace(/^uploads\/|\/uploads\//, '');
    
    // For Cloudinary images
    if (cleanPath.includes('pinterest/')) {
      // Try direct access first
      return `${API_URL}/uploads/${cleanPath}`;
    }
    
    // For local uploads
    return `${API_URL}/uploads/${cleanPath}`;
  };

  const [currentImageUrl, setCurrentImageUrl] = useState(getImageUrl(image));

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', currentImageUrl);
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error('Image failed to load:', currentImageUrl);
    // Try alternative URL if first attempt fails
    if (currentImageUrl.includes('/uploads/pinterest/')) {
      const altUrl = currentImageUrl.replace('/uploads/pinterest/', '/uploads/');
      console.log('Trying alternative URL:', altUrl);
      setCurrentImageUrl(altUrl);
    } else {
      setImageError(true);
    }
    setIsLoading(false);
  };

  // Update useEffect to use currentImageUrl
  React.useEffect(() => {
    console.log('Attempting to load image:', currentImageUrl);
  }, [currentImageUrl]);

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        margin: '8px',
        backgroundColor: '#f0f0f0',
        minHeight: '200px'
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0'
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      )}
      
      {!imageError ? (
        <img
          src={currentImageUrl}
          alt={title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '16px'
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: '16px'
          }}
        >
          <Typography color="textSecondary">
            Image not available
          </Typography>
        </Box>
      )}
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '8px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
          color: 'white'
        }}
      >
        <Typography variant="subtitle1">
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default Pin;