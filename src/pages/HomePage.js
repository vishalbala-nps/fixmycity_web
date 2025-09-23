
import React from 'react';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const HomePage = ({ user }) => {

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.error('Logout Error:', error);
    });
  };

  const handleGetIdToken = () => {
    auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log('ID Token:', idToken);
    }).catch(function(error) {
      console.error('Error getting ID token:', error);
    });
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FixMyCity
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <h1>Welcome, {user.email}</h1>
        <button onClick={handleGetIdToken}>Get ID Token</button>
      </div>
    </div>
  );
};

export default HomePage;
