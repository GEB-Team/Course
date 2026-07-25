import React, { useState, useRef } from 'react';
import { Box, Typography, Button, LinearProgress, Alert, IconButton } from '@mui/material';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const DocumentUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) validateAndSetFile(selected);
  };

  const validateAndSetFile = (selected) => {
    setError('');
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(selected.type)) {
      setError('Only PDF, JPEG, and PNG files are supported.');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    if (selected) validateAndSetFile(selected);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    setProgress(10); // Start progress

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress bar increments
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 500);

      const response = await api.post('/onboarding/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        onUploadSuccess(response.data);
      }, 800);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
      setProgress(0);
      setUploading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h5" mb={1} fontWeight={600}>Upload Official Document</Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Upload your Identity Card, Experience Certificate, or Residence Permit (PDF, JPG, PNG Max 5MB)
      </Typography>

      {!file ? (
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 4,
            p: 6,
            cursor: 'pointer',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              borderColor: 'primary.dark',
            }
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf,image/jpeg,image/png"
            hidden
          />
          <UploadCloud size={64} color="#1976d2" style={{ marginBottom: 16 }} />
          <Typography variant="h6">Drag & Drop your file here</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>or click to browse from your computer</Typography>
        </Box>
      ) : (
        <Box sx={{
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'background.paper'
        }}>
          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <File size={32} color="#f44336" style={{ marginRight: 12 }} />
              <Box textAlign="left">
                <Typography variant="subtitle1" fontWeight={600}>{file.name}</Typography>
                <Typography variant="caption" color="text.secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Typography>
              </Box>
            </Box>
            {!uploading && progress !== 100 && (
              <IconButton onClick={() => setFile(null)} color="error">
                <X />
              </IconButton>
            )}
            {progress === 100 && (
              <CheckCircle color="#4caf50" />
            )}
          </Box>
          
          {uploading && (
            <Box width="100%" mt={2}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {progress < 100 ? 'Extracting text and validating via AI...' : 'Complete!'}
              </Typography>
            </Box>
          )}

          {!uploading && progress !== 100 && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, borderRadius: 2, textTransform: 'none', px: 4 }}
              onClick={handleUpload}
            >
              Start AI Verification
            </Button>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default DocumentUpload;
