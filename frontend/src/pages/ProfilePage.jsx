import React from 'react';
import { 
  Box, Typography, Paper, Grid, Avatar, Chip, Button, 
  Divider, LinearProgress 
} from '@mui/material';
import { Person, Email, Phone, Business, Badge, VerifiedUser, CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto', pb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Employee Profile
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<CloudUpload />}
            onClick={() => navigate('/onboarding')}
          >
            Upload New Documents
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Left profile card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Avatar 
                src={user?.profile_picture} 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mx: 'auto', 
                  mb: 2, 
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  border: '3px solid #38BDF8'
                }}
              >
                {user?.full_name ? user.full_name.charAt(0) : 'U'}
              </Avatar>
              <Typography variant="h6" fontWeight="bold">{user?.full_name || 'Employee Name'}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>{user?.email}</Typography>
              
              <Chip 
                icon={<VerifiedUser />} 
                label={user?.verification_status || 'Pending Verification'} 
                color={user?.verification_status === 'Verified' ? 'success' : 'warning'} 
                sx={{ mt: 1, mb: 3 }}
              />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" color="text.secondary">Profile Completion</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">85%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Official Credentials & Employment Info
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Badge color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                      <Typography variant="body1" fontWeight={600}>{user?.employee_id || 'Pending Issuance'}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Business color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Department</Typography>
                      <Typography variant="body1" fontWeight={600}>{user?.department || 'Operations'}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Person color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Designation</Typography>
                      <Typography variant="body1" fontWeight={600}>{user?.designation || 'Specialist'}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Phone color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                      <Typography variant="body1" fontWeight={600}>{user?.phone_number || '+91 98765 43210'}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Email color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Official Email</Typography>
                      <Typography variant="body1" fontWeight={600}>{user?.email}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <VerifiedUser color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Applicant Classification</Typography>
                      <Typography variant="body1" fontWeight={600}>{user?.applicant_type || 'CITIZEN'}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Document Verification Status
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {user?.verification_status === 'Verified' 
                    ? 'Your official credentials have been verified by the AI OCR validation system and approved by the administrator.'
                    : 'Your verification is currently pending. Please upload your degree certificate, experience letter, or ID to complete verification.'}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => navigate('/onboarding')}
                >
                  {user?.verification_status === 'Verified' ? 'Re-upload Credentials' : 'Start Verification Now'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default ProfilePage;
