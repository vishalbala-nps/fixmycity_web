import React, { useState } from 'react';
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
  const [selectedLocation, setSelectedLocation] = useState(currentLocation || null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category] = useState('Pothole');
  const [department] = useState('Department of Drinking Water and Sanitation');

  const handleUseCurrentLocation = () => {
    setSelectedLocation(currentLocation);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
            disabled
          />
        </Box>
        <Box mb={2} display="flex" gap={2}>
          <FormControl fullWidth disabled>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category">
              <MenuItem value="Pothole">Pothole</MenuItem>
              <MenuItem value="Streetlight">Streetlight</MenuItem>
              <MenuItem value="Garbage">Garbage</MenuItem>
              <MenuItem value="Water Stagnation">Water Stagnation</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth disabled>
            <InputLabel>Department</InputLabel>
            <Select value={department} label="Department">
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
      </Box>
    </Modal>
  );
};

export default ReportIssueModal;
