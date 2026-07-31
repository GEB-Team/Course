import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  
  return (
    <Box sx={{ p: 4, background: '#1e293b', minHeight: '100vh', color: 'white' }}>
      <Typography variant="h4" gutterBottom>Administrator Dashboard</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>Welcome to the GEB Portal Admin Area.</Typography>
      <Button variant="contained" color="secondary" onClick={logout}>Logout</Button>
    </Box>
  );
};

export default AdminDashboard;
