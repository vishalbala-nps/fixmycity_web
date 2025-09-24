import React, { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';


import axios from 'axios';


const CompleteIssueModal = ({ open, onClose, image, setImage, remark, setRemark, reportId, afterSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const remarkRef = useRef(null);

  const handleSubmit = async () => {
    const remarkValue = remarkRef.current ? remarkRef.current.value : '';
    if (!image || !remarkValue.trim() || !reportId) return;
    setLoading(true);
    setError('');
    try {
      const admintoken = localStorage.getItem('admintoken');
      const formData = new FormData();
      formData.append('report', reportId);
  formData.append('status', 'complete');
      formData.append('image', image);
      formData.append('remarks', remarkValue);
      await axios.post(
        process.env.REACT_APP_BACKEND_URL + '/api/admin/issue',
        formData,
        { headers: admintoken ? { Authorization: `Bearer ${admintoken}` } : {} }
      );
      if (afterSubmit) afterSubmit();
      onClose();
    } catch (e) {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        border: '2px solid #388e3c',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6" mb={2} fontWeight={600} align="center" color="success.main">Mark as Complete</Typography>
        <Box mb={2}>
          <Button
            variant="contained"
            component="label"
            color="success"
            fullWidth
            sx={{ borderRadius: 2, fontWeight: 500, fontSize: 13, py: 1 }}
            disabled={loading}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
            />
          </Button>
          {image && (
            <Typography mt={1} color="text.secondary" fontSize={13}>{image.name}</Typography>
          )}
        </Box>
        <Box mb={2}>
          <textarea
            ref={remarkRef}
            defaultValue={remark}
            placeholder="Enter remarks (required)"
            rows={3}
            style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, fontSize: 14 }}
            disabled={loading}
          />
        </Box>
        {error && <Typography color="error" mb={1}>{error}</Typography>}
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1 }}
          disabled={!image || !remarkRef.current || !remarkRef.current.value.trim() || loading}
          onClick={handleSubmit}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} variant="outlined" disabled={loading}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CompleteIssueModal;
