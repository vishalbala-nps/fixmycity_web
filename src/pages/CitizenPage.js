import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Home from './citizen/Home';
import MyReports from './citizen/MyReports';

const CitizenPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState('home');

  const handleLogout = () => {
    signOut(auth);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNav = (selectedPage) => {
    setPage(selectedPage);
    setDrawerOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FixMyCity - Citizen
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
          <List>
            <ListItem button selected={page === 'home'} onClick={() => handleNav('home')}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button selected={page === 'myreports'} onClick={() => handleNav('myreports')}>
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="My Reports" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <div style={{ padding: '20px' }}>
        {page === 'home' && <Home />}
        {page === 'myreports' && <MyReports />}
      </div>
    </div>
  );
};

export default CitizenPage;