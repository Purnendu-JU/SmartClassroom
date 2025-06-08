import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar, Button, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Navbar = () => {
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [addAnchorEl, setAddAnchorEl] = useState(null);
  const navigate = useNavigate();

  function handleAvatarClick(event) {
    setAvatarAnchorEl(event.currentTarget);
  }

  function handleAddClick(event) {
    setAddAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAvatarAnchorEl(null);
    setAddAnchorEl(null);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    handleClose(); // Close the menu
    navigate('/', { replace: true });
    window.location.reload();  // Reload the page
  }


  function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
    };
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Sidebar />
        <Avatar alt="Smart Classroom" src="/favicon.ico" sx={{ width: 33, height: 33, marginRight: 2 }} />
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Smart Classroom
        </Typography>
        <Button
          color="inherit"
          aria-controls="add-menu"
          aria-haspopup="true"
          onClick={handleAddClick}
        >
          <AddIcon sx={{ width: 30, height: 30, color: '#222831' }} />
        </Button>
        <Menu
          id="add-menu"
          anchorEl={addAnchorEl}
          keepMounted
          open={Boolean(addAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/joinclass" style={{ textDecoration: 'none', color: 'black' }}>Join Class</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/createclass" style={{ textDecoration: 'none', color: 'black' }}>Create Class</Link>
          </MenuItem>
        </Menu>
        <Button
          color="inherit"
          aria-controls="avatar-menu"
          aria-haspopup="true"
          onClick={handleAvatarClick}
        >
          <Avatar sx={{ color: '#222831' }} />
        </Button>
        <Menu
          id="avatar-menu"
          anchorEl={avatarAnchorEl}
          keepMounted
          open={Boolean(avatarAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/editprofile" style={{ textDecoration: 'none', color: 'black' }}>Edit Profile</Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
