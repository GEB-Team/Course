import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Button, TextField, InputAdornment, 
  CircularProgress, Alert, Switch, Tooltip 
} from '@mui/material';
import { Search, People, Refresh, ArrowLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch users directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/toggle-status`);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update user status.');
    }
  };

  const filteredUsers = users.filter((u) => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <People color="primary" />
              Employee & User Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage employee accounts, verification badges, and system access.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" startIcon={<ArrowLeft />} onClick={() => navigate('/admin/dashboard')}>
              Back to Overview
            </Button>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchUsers} disabled={loading}>
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Applicant Type</TableCell>
                    <TableCell>Verification</TableCell>
                    <TableCell>Account Status</TableCell>
                    <TableCell align="right">Active Toggle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{u.full_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={u.role} 
                          size="small" 
                          color={u.role === 'ADMIN' ? 'error' : 'primary'} 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {u.employee_id || 'Not Assigned'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{u.applicant_type || 'CITIZEN'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={u.verification_status} 
                          size="small" 
                          color={u.verification_status === 'Verified' ? 'success' : (u.verification_status === 'Rejected' ? 'error' : 'warning')} 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={u.is_active ? 'Active' : 'Disabled'} 
                          size="small" 
                          color={u.is_active ? 'success' : 'default'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={u.is_active ? 'Deactivate User' : 'Activate User'}>
                          <Switch 
                            checked={u.is_active} 
                            onChange={() => handleToggleStatus(u.id)}
                            color="primary"
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
