import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const CitizenPage = () => {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FixMyCity - Citizen
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <h1>Citizen Page</h1>
      </div>
    </div>
  );
};

export default CitizenPage;