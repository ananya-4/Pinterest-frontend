import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import Pin from '../Pin/Pin';
import Masonry from 'react-masonry-css';

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const SearchResults = () => {
  const location = useLocation();
  const { results, searchTerm } = location.state || { results: [], searchTerm: '' };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Search results for "{searchTerm}"
      </Typography>
      {results.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {results.map((pin) => (
            <Pin key={pin._id} {...pin} />
          ))}
        </Masonry>
      ) : (
        <Typography>No results found</Typography>
      )}
    </Box>
  );
};

export default SearchResults;