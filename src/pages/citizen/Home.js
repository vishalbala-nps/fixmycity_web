import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '75vh', // 75% of viewport height
  borderRadius: '16px',
  overflow: 'hidden',
  marginBottom: '16px',
  position: 'relative',
  maxWidth: '100%',
  maxHeight: '80vh',
};

const center = {
  lat: 12.9716, // Example: Bangalore
  lng: 77.5946,
};

const Home = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  return (
    <Box p={0} m={0} width="100%" height="100vh" minHeight="100vh" maxWidth="100%" overflow="hidden">
      <Box px={3} pt={3} pb={1} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h4">Citizen Home</Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ ml: 2 }}>
          Report an Issue
        </Button>
      </Box>
      <Box px={3} pb={1}>
        <Typography>Welcome to your dashboard!</Typography>
      </Box>
      <Box mt={0} mb={0} position="relative" width="100%" height="75vh">
        {isLoaded ? (
          <Box position="relative" width="100%" height="100%">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
            />
          </Box>
        ) : (
          <Box height="100%" width="100%" bgcolor="#e0e0e0" display="flex" alignItems="center" justifyContent="center" borderRadius={2}>
            <Typography color="textSecondary">Loading map...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
