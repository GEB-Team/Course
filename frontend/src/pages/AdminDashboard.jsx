import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Card, CardContent, Typography, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, Avatar, CircularProgress, Alert, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { 
  People, VerifiedUser, HourglassEmpty, AssignmentTurnedIn, 
  CheckCircle, Cancel, Visibility, Refresh, MenuBook, Security 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAdminSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/summary');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load administrator dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSummary();
  }, []);

  const handleApprove = async (docId) => {
    setActionLoading(true);
    try {
      await api.post(`/admin/documents/${docId}/approve`);
      await fetchAdminSummary();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to approve document.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (doc) => {
    setSelectedDoc(doc);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      await api.post(`/admin/documents/${selectedDoc.document_id || selectedDoc.id}/reject`, {
        reason: rejectReason || 'Document did not meet verification criteria'
      });
      setRejectDialogOpen(false);
      await fetchAdminSummary();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to reject document.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  const metrics = data?.metrics || {
    total_employees: 0,
    verified_employees: 0,
    pending_employees: 0,
    total_documents: 0,
    total_courses: 8,
    system_health: '100% Operational',
    ai_accuracy_rate: '96.4%'
  };

  const statCards = [
    { title: 'Total Employees', value: metrics.total_employees, icon: <People />, color: '#38BDF8', path: '/admin/users' },
    { title: 'Verified Profiles', value: metrics.verified_employees, icon: <VerifiedUser />, color: '#10B981', path: '/admin/users' },
    { title: 'Pending Verifications', value: metrics.pending_employees, icon: <HourglassEmpty />, color: '#F59E0B', path: '/admin/documents' },
    { title: 'Documents Uploaded', value: metrics.total_documents, icon: <AssignmentTurnedIn />, color: '#8B5CF6', path: '/admin/documents' },
    { title: 'Active Courses', value: metrics.total_courses, icon: <MenuBook />, color: '#EC4899', path: '/admin/courses' },
    { title: 'AI Accuracy Rate', value: metrics.ai_accuracy_rate, icon: <Security />, color: '#6366F1' },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        {/* Top Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Administrator Command Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time portal telemetry, document verification queue, and user management.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />} 
              onClick={fetchAdminSummary}
              disabled={loading}
            >
              Refresh Data
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<AssignmentTurnedIn />} 
              onClick={() => navigate('/admin/documents')}
            >
              Review Queue ({metrics.pending_employees})
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  cursor: card.path ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  '&:hover': card.path ? { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } : {}
                }}
                onClick={() => card.path && navigate(card.path)}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                  <Avatar sx={{ bgcolor: `${card.color}20`, color: card.color, width: 56, height: 56, mr: 2 }}>
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {card.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Verification Queue & Recent Registrations */}
        <Grid container spacing={3}>
          {/* Document Verification Queue */}
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Document Verification Queue
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded documents awaiting AI/Administrator validation
                  </Typography>
                </Box>
                <Button size="small" onClick={() => navigate('/admin/documents')}>
                  View All
                </Button>
              </Box>

              {(!data?.verification_queue || data.verification_queue.length === 0) ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <CheckCircle sx={{ fontSize: 48, color: 'success.light', mb: 1 }} />
                  <Typography variant="body1">All uploaded documents are verified!</Typography>
                  <Typography variant="caption">New employee uploads will appear here in real time.</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Document Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.verification_queue.map((item) => (
                        <TableRow key={item.document_id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{item.employee_name}</Typography>
                            <Typography variant="caption" color="text.secondary">{item.employee_email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={item.document_type} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={item.verification_status} 
                              size="small" 
                              color={item.verification_status === 'Verified' ? 'success' : (item.verification_status === 'Rejected' ? 'error' : 'warning')} 
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                              <Tooltip title="Approve Verification">
                                <IconButton 
                                  size="small" 
                                  color="success" 
                                  disabled={actionLoading || item.verification_status === 'Verified'}
                                  onClick={() => handleApprove(item.document_id)}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject / Request Re-upload">
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  disabled={actionLoading || item.verification_status === 'Rejected'}
                                  onClick={() => handleOpenReject(item)}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>

          {/* Recent Registrations */}
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Registrations
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Latest registered portal users
                  </Typography>
                </Box>
                <Button size="small" onClick={() => navigate('/admin/users')}>
                  View Directory
                </Button>
              </Box>

              {(!data?.recent_registrations || data.recent_registrations.length === 0) ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <Typography variant="body2">No registered employees yet.</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recent_registrations.map((u) => (
                        <TableRow key={u.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{u.full_name}</Typography>
                            <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{u.applicant_type || 'CITIZEN'}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={u.verification_status} 
                              size="small" 
                              color={u.verification_status === 'Verified' ? 'success' : 'warning'} 
                              sx={{ height: 22, fontSize: '0.7rem' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reject Document Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provide a reason for rejecting the document submitted by {selectedDoc?.employee_name || 'Employee'}:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Blurry scan, missing official seal, or invalid date range"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmReject} color="error" variant="contained" disabled={actionLoading}>
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;
