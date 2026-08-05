import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Divider, Button, 
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, Alert, TextField, MenuItem 
} from '@mui/material';
import { 
  FileText, Download, Eye, RefreshCw, CheckCircle2, 
  ShieldCheck, Upload, X, FileCheck, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

const UploadedDocumentsTab = ({ record, onDocumentUpdated }) => {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Government ID');
  const [selectedName, setSelectedName] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!record) return null;
  const docs = record.uploaded_documents || [];

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('document_name', selectedName || selectedType);
      formData.append('document_type', selectedType);
      formData.append('file', file);

      await api.post('/profile/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploading(false);
      setUploadModalOpen(false);
      setFile(null);
      setSelectedName('');
      if (onDocumentUpdated) onDocumentUpdated();
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Failed to upload document.');
      setUploading(false);
    }
  };

  const handleDownload = (doc) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${doc.document_name.replace(/\s+/g, '_')}.pdf`;
    alert(`Downloading verified service record document: "${doc.document_name}"`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Uploaded Government & Service Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Digitally attested service certificates, credentials, and statutory identification proofs.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Upload size={16} />}
          onClick={() => setUploadModalOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Upload / Replace Document
        </Button>
      </Box>

      <Grid container spacing={3}>
        {docs.map((doc, idx) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id || idx}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main' }}>
                    <FileText size={24} />
                  </Box>
                  <Chip
                    icon={<CheckCircle2 size={12} />}
                    label={doc.verification_status || 'Verified'}
                    size="small"
                    color="success"
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                </Box>

                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 0.5, minHeight: 48 }}>
                  {doc.document_name}
                </Typography>

                <Typography variant="caption" color="primary.main" fontWeight={600} display="block">
                  Type: {doc.document_type}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Uploaded: {doc.upload_date || '10-Apr-2023'} • Size: {doc.file_size || '2.1 MB'}
                </Typography>
              </Box>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Eye size={14} />}
                  onClick={() => setPreviewDoc(doc)}
                  sx={{ flex: 1, borderRadius: 2, textTransform: 'none' }}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  startIcon={<Download size={14} />}
                  onClick={() => handleDownload(doc)}
                  sx={{ flex: 1, borderRadius: 2, textTransform: 'none' }}
                >
                  Download
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Document Preview Modal */}
      <Dialog 
        open={Boolean(previewDoc)} 
        onClose={() => setPreviewDoc(null)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileCheck size={20} color="#2563EB" />
            <Typography variant="subtitle1" fontWeight={700}>
              {previewDoc?.document_name}
            </Typography>
          </Box>
          <IconButton onClick={() => setPreviewDoc(null)} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4, textAlign: 'center', bgcolor: '#F8FAFC' }}>
          <Paper sx={{ p: 4, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
            <FileText size={64} color="#2563EB" style={{ margin: '0 auto 16px' }} />
            <Typography variant="h6" fontWeight={700}>
              Official Attested Document
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Document Type: <strong>{previewDoc?.document_type}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload Date: <strong>{previewDoc?.upload_date}</strong> • File Size: <strong>{previewDoc?.file_size}</strong>
            </Typography>
            <Chip 
              icon={<ShieldCheck size={14} />} 
              label="Digitally Signed & Encrypted" 
              color="success" 
              sx={{ mt: 2, fontWeight: 600 }} 
            />
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPreviewDoc(null)} color="inherit">Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Download size={16} />}
            onClick={() => handleDownload(previewDoc)}
          >
            Download Original PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload/Replace Document Modal */}
      <Dialog 
        open={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            Upload or Replace Service Document
          </Typography>
          <IconButton onClick={() => setUploadModalOpen(false)} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <form onSubmit={handleUploadSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}

            <TextField
              select
              fullWidth
              label="Document Classification"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{ mb: 2.5 }}
            >
              <MenuItem value="Government ID">National Identity Card / Aadhaar</MenuItem>
              <MenuItem value="Degree Certificate">Highest Degree Certificate</MenuItem>
              <MenuItem value="Experience Certificate">Previous Experience Relieving Record</MenuItem>
              <MenuItem value="Appointment Order">Official Appointment Order & Gazette</MenuItem>
              <MenuItem value="Residence Permit">Residence Permit / Visa</MenuItem>
              <MenuItem value="Other Supporting Documents">Other Supporting Document</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Document Title"
              placeholder="e.g., Degree Certificate (NIT)"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              sx={{ mb: 2.5 }}
              required
            />

            <Box 
              sx={{ 
                p: 3, 
                border: '2px dashed #CBD5E1', 
                borderRadius: 2, 
                textAlign: 'center', 
                bgcolor: '#F8FAFC',
                cursor: 'pointer'
              }}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                id="doc-file-input"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="doc-file-input" style={{ cursor: 'pointer' }}>
                <Upload size={36} color="#2563EB" style={{ margin: '0 auto 8px' }} />
                <Typography variant="body2" fontWeight={600}>
                  {file ? file.name : 'Click to select PDF or image document (Max 5MB)'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: PDF, PNG, JPG
                </Typography>
              </label>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setUploadModalOpen(false)} color="inherit">Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload & Verify'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </motion.div>
  );
};

export default UploadedDocumentsTab;
