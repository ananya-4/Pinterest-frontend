import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, InputBase, IconButton, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PinterestIcon from '@mui/icons-material/Pinterest';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/AuthContext';
import { searchPins } from '../../services/pinService';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const results = await searchPins(searchTerm);
      navigate('/search', { state: { results, searchTerm } });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
          <PinterestIcon sx={{ color: '#E60023', fontSize: 30 }} />
        </IconButton>

        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, mx: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: '#e9e9e9', 
            borderRadius: '25px', 
            px: 1.5,
            py: 0.5,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <SearchIcon sx={{ color: 'gray', mr: 1, fontSize: '1.2rem' }} />
            <InputBase
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                flex: 1,
                fontSize: '0.9rem',
                '& .MuiInputBase-input': {
                  padding: '4px 0'
                }
              }}
            />
          </Box>
        </Box>

        {user ? (
          <>
            <Button
              startIcon={<AddIcon />}
              onClick={() => navigate('/create')}
              sx={{ mr: 2 }}
            >
              Create
            </Button>
            <IconButton onClick={handleMenu}>
              <Avatar 
                src={user.profilePicture} 
                alt={user.username}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '16px',
                  minWidth: '180px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
                  mt: 1
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  handleClose();
                  navigate(`/profile/${user.username}`);
                }}
                sx={{ py: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    src={user.profilePicture} 
                    alt={user.username}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      View profile
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#E60023',
                '&:hover': {
                  bgcolor: '#ad081b'
                }
              }} 
              onClick={() => navigate('/register')}
            >
              Sign up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;