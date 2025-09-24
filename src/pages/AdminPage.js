
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CancelIcon from '@mui/icons-material/Cancel';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { submittedIcon, inProgressIcon, completeIcon } from './citizen/statusIcons';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import dayjs from 'dayjs';
import Modal from '@mui/material/Modal';


const defaultCenter = [12.9716, 77.5946]; // Bangalore

const AdminPage = () => {
  const [position, setPosition] = useState(defaultCenter);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('submitted');
  // Filtered markers based on status
  const filteredMarkers = statusFilter === 'all'
    ? markers
    : markers.filter((m) => m.status === statusFilter);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Fetch issues logic as a function so we can refresh after status change
  const fetchIssues = () => {
    setLoading(true);
    const admintoken = localStorage.getItem('admintoken');
    axios.get(process.env.REACT_APP_BACKEND_URL + '/api/admin/issue', {
      headers: admintoken ? { Authorization: `Bearer ${admintoken}` } : {}
    })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMarkers(response.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

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
    fetchIssues();
  }, []);

  // Handler to change status
  const handleStatusChange = (status) => {
    if (!selectedIssue) return;
    setStatusLoading(true);
    const admintoken = localStorage.getItem('admintoken');
    if (status === 'progress') {
      // Use multipart/form-data for in progress
      const formData = new FormData();
      formData.append('status', 'progress');
      formData.append('report', selectedIssue.id);
      axios.post(
        process.env.REACT_APP_BACKEND_URL + '/api/admin/issue',
        formData,
        { headers: admintoken ? { Authorization: `Bearer ${admintoken}` } : {} }
      )
        .then(() => {
          setModalOpen(false);
          setSelectedIssue(null);
          fetchIssues();
        })
        .catch(() => {
          // Optionally show error
        })
        .finally(() => setStatusLoading(false));
    } else {
      // PATCH for other statuses
      axios.patch(
        process.env.REACT_APP_BACKEND_URL + `/api/admin/issue/${selectedIssue.id}/status`,
        { status },
        { headers: admintoken ? { Authorization: `Bearer ${admintoken}` } : {} }
      )
        .then(() => {
          setModalOpen(false);
          setSelectedIssue(null);
          fetchIssues();
        })
        .catch(() => {
          // Optionally show error
        })
        .finally(() => setStatusLoading(false));
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FixMyCity - Admin
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight={700}>
            Admin Page
          </Typography>
          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(_, val) => val && setStatusFilter(val)}
            aria-label="Status Filter"
            size="small"
            color="primary"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="submitted">Submitted</ToggleButton>
            <ToggleButton value="progress">In Progress</ToggleButton>
            <ToggleButton value="complete">Complete</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box mt={2} width="100%" height="75vh">
          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <Typography variant="h6">Loading map...</Typography>
            </Box>
          ) : (
            <MapContainer center={position} zoom={14} style={{ width: '100%', height: '100%', borderRadius: '16px' }} scrollWheelZoom={true} key={position.join(',')}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
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
              <MarkerClusterGroup>
                {filteredMarkers.map((issue, idx) => {
                  let icon = submittedIcon;
                  if (issue.status === 'progress') icon = inProgressIcon;
                  else if (issue.status === 'complete') icon = completeIcon;
                  return (
                    <Marker
                      key={issue.id || idx}
                      position={[issue.lat, issue.lon]}
                      icon={icon}
                      eventHandlers={{
                        click: () => {
                          setSelectedIssue(issue);
                          setModalOpen(true);
                        }
                      }}
                    />
                  );
                })}
              </MarkerClusterGroup>
              {/* Issue Details Modal */}
              <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 350,
                  bgcolor: 'background.paper',
                  border: '2px solid #1976d2',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}>
                  {selectedIssue && (
                    <>
                      <Typography variant="h6" mb={2} fontWeight={600} align="center">Issue Details</Typography>
                      {selectedIssue.images && selectedIssue.images[0] && (
                        <Box mb={2} display="flex" justifyContent="center">
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/api/image/${selectedIssue.images[0]}`}
                            alt="Issue"
                            style={{ maxWidth: 180, maxHeight: 120, borderRadius: 6, border: '1px solid #1976d2' }}
                          />
                        </Box>
                      )}
                      <Typography variant="body1" mb={1}><b>Category:</b> {selectedIssue.category}</Typography>
                      <Typography variant="body1" mb={1}><b>Description:</b> {selectedIssue.description}</Typography>
                      <Typography variant="body1" mb={1}><b>Department:</b> {selectedIssue.department}</Typography>
                      <Typography variant="body1" mb={1}><b>Status:</b> {selectedIssue.status === 'submitted' ? 'Submitted' : selectedIssue.status === 'progress' ? 'In Progress' : selectedIssue.status === 'complete' ? 'Complete' : selectedIssue.status}</Typography>
                      <Typography variant="body1" mb={1}><b>Date:</b> {selectedIssue.dateofreport ? dayjs(selectedIssue.dateofreport).format('DD MMM YYYY') : '-'}</Typography>
                      {selectedIssue.count !== undefined && (
                        <Typography variant="body1" mb={1}><b>Reported By:</b> {selectedIssue.count} people</Typography>
                      )}
                      <Stack direction="column" spacing={0.5} mt={1} mb={2}>
                        <Button
                          onClick={() => handleStatusChange('progress')}
                          color="info"
                          variant="contained"
                          disabled={statusLoading}
                          startIcon={<HourglassTopIcon />}
                          sx={{ borderRadius: 2, fontWeight: 500, fontSize: 13, py: 0.7, minHeight: 32, minWidth: 0 }}
                          fullWidth
                        >
                          In Progress
                        </Button>
                        <Button
                          onClick={() => handleStatusChange('complete')}
                          color="success"
                          variant="contained"
                          disabled={statusLoading}
                          startIcon={<CheckCircleIcon />}
                          sx={{ borderRadius: 2, fontWeight: 500, fontSize: 13, py: 0.7, minHeight: 32, minWidth: 0 }}
                          fullWidth
                        >
                          Complete
                        </Button>
                      </Stack>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button onClick={() => setModalOpen(false)} variant="outlined">Close</Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Modal>
            </MapContainer>
          )}
        </Box>
      </div>
    </div>
  );
};

export default AdminPage;