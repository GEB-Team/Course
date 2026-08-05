import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Button, IconButton, Tooltip, CircularProgress, 
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Divider 
} from '@mui/material';
import { CheckCircle, Cancel, Visibility, Refresh, AssignmentTurnedIn, ArrowLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const AdminDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/documents');
      setDocuments(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load uploaded documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleApprove = async (docId) => {
    setActionLoading(true);
    try {
      await api.post(`/admin/documents/${docId}/approve`);
      await fetchDocs();
      if (viewDialogOpen) setViewDialogOpen(false);
    } catch (err) {
      alert(err.response?.data?.detail || 'Approval failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      await api.post(`/admin/documents/${selectedDoc.id}/reject`, {
        reason: rejectReason || 'Document criteria not met'
      });
      setRejectDialogOpen(false);
      if (viewDialogOpen) setViewDialogOpen(false);
      await fetchDocs();
    } catch (err) {
      alert(err.response?.data?.detail || 'Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const openViewModal = (doc) => {
    setSelectedDoc(doc);
    setViewDialogOpen(true);
  };

  const openRejectModal = (doc) => {
    setSelectedDoc(doc);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AssignmentTurnedIn color="primary" />
              Document Approval Queue
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review OCR-extracted documents, AI confidence scores, and verify employee applications.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" startIcon={<ArrowLeft />} onClick={() => navigate('/admin/dashboard')}>
              Back to Overview
            </Button>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchDocs} disabled={loading}>
              Refresh
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {documents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1.5 }} />
                <Typography variant="h6">No uploaded documents</Typography>
                <Typography variant="body2">When employees upload credentials via the onboarding module, they will appear here.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Document Type</TableCell>
                      <TableCell>AI Confidence</TableCell>
                      <TableCell>Uploaded Date</TableCell>
                      <TableCell>Verification Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{doc.user_name}</Typography>
                          <Typography variant="caption" color="text.secondary">{doc.user_email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={doc.document_type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${doc.confidence_score}% Match`} 
                            size="small" 
                            color={doc.confidence_score >= 85 ? 'success' : (doc.confidence_score >= 60 ? 'warning' : 'error')}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{new Date(doc.uploaded_at).toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={doc.user_status} 
                            size="small" 
                            color={doc.user_status === 'Verified' ? 'success' : (doc.user_status === 'Rejected' ? 'error' : 'warning')} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="View Details & Extracted OCR">
                              <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<Visibility />} 
                                onClick={() => openViewModal(doc)}
                              >
                                Review
                              </Button>
                            </Tooltip>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="success" 
                              disabled={actionLoading || doc.user_status === 'Verified'}
                              onClick={() => handleApprove(doc.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error" 
                              disabled={actionLoading || doc.user_status === 'Rejected'}
                              onClick={() => openRejectModal(doc)}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* View Document Details Modal */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Document & AI Extraction Audit</DialogTitle>
          <DialogContent dividers>
            {selectedDoc && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Applicant Name</Typography>
                    <Typography variant="body1" fontWeight={600}>{selectedDoc.user_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Applicant Email</Typography>
                    <Typography variant="body1">{selectedDoc.user_email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Document Category</Typography>
                    <Typography variant="body1">{selectedDoc.document_type}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">AI Verification Confidence</Typography>
                    <Typography variant="body1" color="success.main" fontWeight={600}>{selectedDoc.confidence_score}%</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Extracted Document Text (AI OCR Stream)
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'action.hover', maxHeight: 200, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {selectedDoc.extracted_text || 'No extracted text stream available.'}
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button 
              color="error" 
              variant="outlined" 
              onClick={() => { setViewDialogOpen(false); openRejectModal(selectedDoc); }}
            >
              Reject Document
            </Button>
            <Button 
              color="success" 
              variant="contained" 
              disabled={actionLoading || selectedDoc?.user_status === 'Verified'}
              onClick={() => handleApprove(selectedDoc.id)}
            >
              Approve Document
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reject Modal */}
        <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Reject Document Verification</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Provide rejection explanation for {selectedDoc?.user_name}:
            </Typography>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Unclear signature or unverified experience duration"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmReject} color="error" variant="contained" disabled={actionLoading}>
              Confirm Rejection
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default AdminDocumentsPage;
