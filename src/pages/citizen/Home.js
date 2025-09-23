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
import { getIdToken } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../../firebase';
import { Typography, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ReportIssueModal from './ReportIssueModal';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { submittedIcon, inProgressIcon, completeIcon } from './statusIcons';
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
  const [modalOpen, setModalOpen] = useState(false);
  // Markers from /api/issue
  const [markers, setMarkers] = useState([]);
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
    // Get Firebase idToken and fetch issues
    function fetchIssues() {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      getIdToken(user)
        .then((idToken) => {
          return axios.get(process.env.REACT_APP_BACKEND_URL + '/api/issue', {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          });
        })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setMarkers(response.data);
          }
        })
        .catch((err) => {
          // Optionally handle error
        })
        .finally(() => {
          setLoading(false);
        });
    }
    fetchIssues();
  }, []);


  // Access the current Firebase user object
  const user = auth.currentUser;
  console.log('Firebase user:', user);
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
          <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={() => setModalOpen(true)}>
          Report an Issue
        </Button>
      </Box>
    <ReportIssueModal open={modalOpen} onClose={() => setModalOpen(false)} currentLocation={position} />
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
             {/* User's current location as a blue circle */}
             <Circle
               center={position}
               radius={70}
               pathOptions={{
                 color: '#1976d2',
                 fillColor: '#1976d2',
                 fillOpacity: 0.7,
                 weight: 5,
                 opacity: 1,
                 dashArray: '2',
                 className: 'user-location-glow'
               }}
             />
             {/* Clustered markers from API */}
             <MarkerClusterGroup>
               {markers.map((issue, idx) => {
                 let icon = submittedIcon;
                 if (issue.status === 'in progress') icon = inProgressIcon;
                 else if (issue.status === 'complete') icon = completeIcon;
                 return (
                   <Marker key={issue.id || idx} position={[issue.lat, issue.lon]} icon={icon}>
                     <Popup>
                       <b>{issue.category}</b><br/>
                       {issue.description}<br/>
                       <i>{issue.department}</i><br/>
                       Status: {issue.status}<br/>
                       Date: {issue.dateofreport}
                     </Popup>
                   </Marker>
                 );
               })}
             </MarkerClusterGroup>
           </MapContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
