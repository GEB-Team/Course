import React, { useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import EmployeeTab from '../components/auth/EmployeeTab';
import AdminTab from '../components/auth/AdminTab';

const AuthPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4, color: 'var(--dark-grey)' }}>
          <Typography variant="h4" component="h1" gutterBottom className="brand-title">
            GEB Portal
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'var(--dark-grey)' }}>
            Government Enterprise Business System
          </Typography>
        </Box>

        <Paper className="pinterest-card" elevation={0}>
          <div className="pill-toggle-container">
            <div 
              className={`pill-tab tab-employee ${tab === 0 ? 'active' : ''}`}
              onClick={() => setTab(0)}
            >
              User Login
            </div>
            <div 
              className={`pill-tab tab-admin ${tab === 1 ? 'active' : ''}`}
              onClick={() => setTab(1)}
            >
              Administrator
            </div>
          </div>
          
          {tab === 0 && <EmployeeTab />}
          {tab === 1 && <AdminTab />}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
