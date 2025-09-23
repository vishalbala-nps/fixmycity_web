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
import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';


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



const Home = () => {
  const defaultCenter = [12.9716, 77.5946]; // Bangalore
  const [position, setPosition] = useState(defaultCenter);
  // Example: 100 random markers in Chennai area
  const [markers] = useState(() => {
    const arr = [];
    for (let i = 0; i < 100; i++) {
      arr.push([
        13.0827 + (Math.random() - 0.5) * 0.2, // Chennai latitude
        80.2707 + (Math.random() - 0.5) * 0.2, // Chennai longitude
      ]);
    }
    return arr;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          setPosition(defaultCenter);
        }
      );
    }
    // Show loading until GET request completes
    import('axios').then(({ default: axios }) => {
      axios.get('https://example.com').then(() => {
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh" width="100vw">
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

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
           <MapContainer center={position} zoom={12} style={{ width: '100%', height: '100%', borderRadius: '16px' }} scrollWheelZoom={true} key={position.join(',')}>
             <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             />
             {/* User's current location marker, always visible */}
             <Marker position={position}>
               <Popup>
                 You are here
               </Popup>
             </Marker>
             {/* Clustered markers */}
             <MarkerClusterGroup>
               {markers.map((pos, idx) => (
                 <Marker key={idx} position={pos}>
                   <Popup>Marker {idx + 1}</Popup>
                 </Marker>
               ))}
             </MarkerClusterGroup>
           </MapContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
