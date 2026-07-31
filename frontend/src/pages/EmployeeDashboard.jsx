import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const { logout } = useAuth();
  
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Employee Dashboard</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>Welcome to the GEB Portal Employee Area.</Typography>
      <Button variant="contained" color="primary" onClick={logout}>Logout</Button>
    </Box>
  );
};

export default EmployeeDashboard;
