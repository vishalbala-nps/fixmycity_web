import React from 'react';
import { Typography, Box, Button } from '@mui/material';


const Home = () => (
  <Box p={2}>
    <Typography variant="h4">Citizen Home</Typography>
    <Typography>Welcome to your dashboard!</Typography>
    <Box mt={4} mb={2}>
      {/* Map Placeholder */}
      <Box height={300} width="100%" bgcolor="#e0e0e0" display="flex" alignItems="center" justifyContent="center" borderRadius={2}>
        <Typography color="textSecondary">[Map will be displayed here]</Typography>
      </Box>
    </Box>
    <Button variant="contained" color="primary">Report an Issue</Button>
  </Box>
);

export default Home;
