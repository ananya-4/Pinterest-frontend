import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CreatePinButton = () => {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      sx={{
        borderRadius: '24px',
        backgroundColor: '#e60023',
        '&:hover': {
          backgroundColor: '#ad081b'
        }
      }}
    >
      Create Pin
    </Button>
  );
};

export default CreatePinButton;