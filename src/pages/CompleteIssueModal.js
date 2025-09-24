import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';

const CompleteIssueModal = ({ open, onClose, image, setImage, remark, setRemark }) => (
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
          value={remark}
          onChange={e => setRemark(e.target.value)}
          placeholder="Enter remarks (required)"
          rows={3}
          style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, fontSize: 14 }}
        />
      </Box>
      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1 }}
        disabled={!image || !remark.trim()}
        onClick={onClose}
      >
        Submit (not implemented)
      </Button>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
      </Box>
    </Box>
  </Modal>
);

export default CompleteIssueModal;
