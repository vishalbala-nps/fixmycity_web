import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// Fix leaflet's default icon path issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet'

const mapStyle = {
  width: '100%',
  height: '75vh',
  borderRadius: '16px',
  overflow: 'hidden',
  marginBottom: '16px',
  position: 'relative',
  maxWidth: '100%',
  maxHeight: '80vh',
};

const center = [12.9716, 77.5946]; // Bangalore

const Home = () => {
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
        <Box position="relative" width="100%" height="100%" sx={mapStyle}>
          <MapContainer center={center} zoom={12} style={{ width: '100%', height: '100%', borderRadius: '16px' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center}>
              <Popup>
                You are here (Bangalore)
              </Popup>
            </Marker>
          </MapContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
