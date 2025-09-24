import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getIdToken } from 'firebase/auth';
import { auth } from '../../firebase';
import dayjs from 'dayjs';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Modal,
  Button
} from '@mui/material';

const statusColor = (status) => {
  if (status === 'complete') return 'success';
  if (status === 'in progress') return 'info';
  return 'warning';
};

const modalStyle = {
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
};

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResolved, setSelectedResolved] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError('');
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }
      try {
        const idToken = await getIdToken(user);
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + '/api/issue?filter=user',
          {
            headers: { Authorization: `Bearer ${idToken}` }
          }
        );
        setReports(res.data || []);
      } catch (err) {
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} fontWeight={600}>
        My Reports
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Category</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Reports</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((r) => {
                const isResolved = r.status === 'complete' && r.resolved;
                return (
                  <TableRow
                    key={r.id}
                    hover={!!isResolved}
                    style={isResolved ? { cursor: 'pointer' } : {}}
                    onClick={() => {
                      if (isResolved) {
                        setSelectedResolved(r.resolved);
                        setModalOpen(true);
                      }
                    }}
                  >
                    <TableCell>{dayjs(r.dateofreport).format('DD MMM YYYY')}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell>
                      <Chip label={r.status === 'complete' ? 'Complete' : r.status === 'in progress' ? 'In Progress' : 'Submitted'} color={statusColor(r.status)} size="small" />
                    </TableCell>
                    <TableCell>{r.count}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Resolved Issue Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2} fontWeight={600} align="center">Resolution Details</Typography>
          {selectedResolved && (
            <>
              <Typography variant="body1" mb={1}><b>Date of Completion:</b> {selectedResolved.dateofresolution ? dayjs(selectedResolved.dateofresolution).format('DD MMM YYYY') : '-'}</Typography>
              {selectedResolved.image && (
                <Box mb={2} display="flex" justifyContent="center">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/api/image/${selectedResolved.image}`}
                    alt="Resolved"
                    style={{ maxWidth: 180, maxHeight: 120, borderRadius: 6, border: '1px solid #1976d2' }}
                  />
                </Box>
              )}
              <Typography variant="body2" mb={2}><b>Remarks:</b> {selectedResolved.remarks || '-'}</Typography>
              <Box display="flex" justifyContent="flex-end">
                <Button onClick={() => setModalOpen(false)} variant="contained">Close</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MyReports;
