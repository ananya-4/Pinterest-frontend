import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import Pin from '../Pin/Pin';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getPins } from '../../services/pinService';
import '../../styles/PinGrid.css';

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const PinGrid = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const data = await getPins();
        setPins(data);
      } catch (err) {
        setError('Failed to load pins');
        console.error('Error fetching pins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {pins.map((pin) => (
          <Pin key={pin._id} image={pin.image} title={pin.title} />
        ))}
      </Masonry>
    </div>
  );
};

export default PinGrid;