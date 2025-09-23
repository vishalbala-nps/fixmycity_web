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
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateReportId, setDuplicateReportId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  

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
      setDescription('');
      setImage(null);
      setCategory('Pothole');
      setDepartment('Department of Drinking Water and Sanitation');
      setErrorMsg('');
      setFieldsEditable(false);
      setLoading(false);
      setIsDuplicate(false);
      setDuplicateReportId(null);
    }
  }, [open, currentLocation]);

  const handleImageChange = (e) => {
    setErrorMsg('');
    const file = e.target.files[0];
    setImage(file);
    setFieldsEditable(true);
    setIsDuplicate(false); // reset duplicate state
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
          if (res.data.duplicate !== undefined) setIsDuplicate(res.data.duplicate);
          if (res.data.image) setUploadedImage(res.data.image);
          if (res.data.duplicate && res.data.report) setDuplicateReportId(res.data.report);
        }
      }).catch((err) => {
        setErrorMsg('Failed to process image. Please try again.');
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const handleSubmit = () => {
    setErrorMsg("");
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      setErrorMsg("You must be logged in to submit an issue.");
      setLoading(false);
      return;
    }
    getIdToken(user).then((idToken) => {
      let payload;
      if (isDuplicate) {
        payload = {
          duplicate: true,
          image: uploadedImage,
          report: duplicateReportId || '',
        };
      } else {
        payload = {
          duplicate: false,
          image: uploadedImage,
          description,
          category,
          department,
          lat: selectedLocation ? selectedLocation[0] : '',
          lon: selectedLocation ? selectedLocation[1] : ''
        };
      }
      return axios.post(
        process.env.REACT_APP_BACKEND_URL + '/api/issue',
        payload,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }).then(() => {
      onClose();
    }).catch(() => {
      setErrorMsg('Failed to submit issue. Please try again.');
    }).finally(() => {
      setLoading(false);
    });
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
        {isDuplicate ? (
          <Box mb={2}>
            <Typography color="warning.main" align="center" fontWeight={700} fontSize={22} mb={2}>
              Duplicate Issue Detected
            </Typography>
            <Typography align="center" color="text.secondary" fontSize={16} mb={2}>
              This issue may have already been reported. Please review the details below:
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
              {image && typeof image === 'object' && image instanceof File && (
                <img
                  src={process.env.REACT_APP_BACKEND_URL+"/api/image/"+uploadedImage}
                  alt="Duplicate Issue"
                  style={{ maxWidth: 260, maxHeight: 200, borderRadius: 10, marginBottom: 16, border: '2px solid #ffa726', boxShadow: '0 2px 12px #ffecb3' }}
                />
              )}
              <Typography variant="h6" fontWeight={600} color="warning.dark" mb={1}>
                Description
              </Typography>
              <Typography fontSize={17} mb={1} color="text.primary" align="center">{description}</Typography>
              <Typography variant="h6" fontWeight={600} color="warning.dark" mb={1}>
                Category
              </Typography>
              <Typography fontSize={17} mb={1} color="text.primary">{category}</Typography>
              <Typography variant="h6" fontWeight={600} color="warning.dark" mb={1}>
                Department
              </Typography>
              <Typography fontSize={17} color="text.primary">{department}</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button onClick={onClose}>Close</Button>
              <Button variant="contained" onClick={handleSubmit} disabled={!selectedLocation || !description}>
                Submit
              </Button>
            </Box>
          </Box>
        ) : (
          <>
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
                zoom={16}
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
          </>
        )}
        </>}
      </Box>
    </Modal>
  );
};

export default ReportIssueModal;
