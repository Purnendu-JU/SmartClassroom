import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = ({ className }) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontSize: '45px'}}>
          {className}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
