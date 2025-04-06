import React, { useState } from 'react';
import { IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleMenu}>
        <Avatar sx={{ width: 24, height: 24 }}>
          {user ? user.name[0] : 'U'}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={() => {
          logout();
          handleClose();
        }}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;