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
  Chip
} from '@mui/material';

const statusColor = (status) => {
  if (status === 'complete') return 'success';
  if (status === 'in progress') return 'info';
  return 'warning';
};

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{dayjs(r.dateofreport).format('DD MMM YYYY')}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>{r.department}</TableCell>
                  <TableCell>
                    <Chip label={r.status === 'complete' ? 'Complete' : r.status === 'in progress' ? 'In Progress' : 'Submitted'} color={statusColor(r.status)} size="small" />
                  </TableCell>
                  <TableCell>{r.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyReports;
