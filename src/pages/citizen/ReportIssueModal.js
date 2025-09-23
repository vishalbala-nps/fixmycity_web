import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { getIdToken } from 'firebase/auth';
import { auth } from '../../firebase';
import axios from 'axios';
import { Box, Modal, Typography, Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  maxWidth: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function LocationSelector({ value, onChange }) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return value ? <Marker position={value} /> : null;
}

const ReportIssueModal = ({ open, onClose, currentLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('Pothole');
  const [department, setDepartment] = useState('Department of Drinking Water and Sanitation');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldsEditable, setFieldsEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUseCurrentLocation = () => {
    setSelectedLocation(currentLocation);
  };

  // When modal opens, set selectedLocation to currentLocation
  React.useEffect(() => {
    if (open && currentLocation) {
      setSelectedLocation(currentLocation);
    }
    if (!open) {
      setSelectedLocation(null);
    }
  }, [open, currentLocation]);

  const handleImageChange = (e) => {
    setErrorMsg('');
    const file = e.target.files[0];
    setImage(file);
    setFieldsEditable(true);
    // Only proceed if file and selectedLocation are available
    if (file && selectedLocation) {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('lat', selectedLocation[0]);
      formData.append('lon', selectedLocation[1]);
      const user = auth.currentUser;
      if (!user) {
        setErrorMsg('You must be logged in to upload an image.');
        setLoading(false);
        return;
      }
      getIdToken(user).then((idToken) => {
        return axios.post(
          process.env.REACT_APP_BACKEND_URL + '/api/issue/summary',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${idToken}`
            }
          }
        );
      }).then((res) => {
        // Update description, category, department from response if present
        if (res && res.data) {
          if (res.data.description) setDescription(res.data.description);
          if (res.data.category) setCategory(res.data.category);
          if (res.data.department) setDepartment(res.data.department);
        }
      }).catch((err) => {
        setErrorMsg('Failed to process image. Please try again.');
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const handleSubmit = () => {
    // Submit logic here
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, p: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" mb={3} align="center" fontWeight={600} letterSpacing={1}>
          Report an Issue
        </Typography>
        {loading && (
          <Box mb={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <CircularProgress />
            <Typography mt={2}>Processing image...</Typography>
          </Box>
        )}
        {!loading && <>
        {errorMsg && (
          <Box mb={2}>
            <Typography color="error" align="center">{errorMsg}</Typography>
          </Box>
        )}
        <Box mb={3} display="flex" flexDirection="column" alignItems="center">
          <Button
            variant="contained"
            component="label"
            sx={{
              bgcolor: '#1976d2',
              color: 'white',
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontSize: 16,
              boxShadow: 2,
              mb: 1
            }}
          >
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          {image && <Typography mt={1} color="text.secondary">{image.name}</Typography>}
        </Box>
        <Box mb={3}>
          <Button variant="outlined" onClick={handleUseCurrentLocation} disabled={!currentLocation} sx={{ mb: 1 }}>
            Use Current Location
          </Button>
          <MapContainer
            center={selectedLocation || currentLocation || [12.9716, 77.5946]}
            zoom={13}
            style={{ width: '100%', height: 300, borderRadius: 8 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationSelector value={selectedLocation} onChange={setSelectedLocation} />
          </MapContainer>
        </Box>
        <Box mb={2}>
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ background: '#f5f5f5', borderRadius: 1 }}
            disabled={!fieldsEditable}
          />
        </Box>
        <Box mb={2} display="flex" gap={2}>
          <FormControl fullWidth disabled={!fieldsEditable}>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={e => setCategory(e.target.value)}>
              <MenuItem value="Pothole">Pothole</MenuItem>
              <MenuItem value="Streetlight">Streetlight</MenuItem>
              <MenuItem value="Garbage">Garbage</MenuItem>
              <MenuItem value="Water Stagnation">Water Stagnation</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!fieldsEditable}>
            <InputLabel>Department</InputLabel>
            <Select value={department} label="Department" onChange={e => setDepartment(e.target.value)}>
              <MenuItem value="Department of Drinking Water and Sanitation">Department of Drinking Water and Sanitation</MenuItem>
              <MenuItem value="Department of Rural Works">Department of Rural Works</MenuItem>
              <MenuItem value="Department of Road Construction">Department of Road Construction</MenuItem>
              <MenuItem value="Department of Energy">Department of Energy</MenuItem>
              <MenuItem value="Department of Health, Medical Education & Family Welfare">Department of Health, Medical Education & Family Welfare</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!selectedLocation || !description}>
            Submit
          </Button>
        </Box>
        </>}
      </Box>
    </Modal>
  );
};

export default ReportIssueModal;
