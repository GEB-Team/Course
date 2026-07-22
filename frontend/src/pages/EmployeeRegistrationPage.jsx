import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const EmployeeRegistrationPage = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const applicantType = watch('applicant_type');
  const googleData = location.state?.googleData;

  useEffect(() => {
    if (googleData) {
      setValue('full_name', googleData.name || '');
      setValue('email', googleData.email || '');
      // we could also display the picture if needed
    }
  }, [googleData, setValue]);

  // Mock dynamic updates for Groups and Sub Categories
  const groups = ['Engineering', 'Administration', 'Operations', 'Finance'];
  const getSubCategories = (group) => {
    switch(group) {
      case 'Engineering': return ['Software', 'Hardware', 'Civil'];
      case 'Administration': return ['HR', 'Management'];
      case 'Operations': return ['Logistics', 'Support'];
      case 'Finance': return ['Accounting', 'Audit'];
      default: return [];
    }
  };
  
  const selectedGroup = watch('group');
  const subCategories = getSubCategories(selectedGroup);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      // In a real scenario, if googleData exists we might not need to send password,
      // but for this implementation we assume manual password is required if registering manually
      // If it's a google registration flow, we should handle that in backend
      const payload = { ...data };
      if (payload.username === "") payload.username = undefined;
      if (payload.phone_number === "") payload.phone_number = undefined;
      
      if (googleData) {
        // Generate a random password for google sign-ups since we don't need it, or handle in backend
        payload.password = payload.password || Math.random().toString(36).slice(-8);
        payload.confirm_password = payload.confirm_password || payload.password;
      }
      
      const response = await api.post('/auth/register', payload);
      // Auto login after registration
      navigate('/');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '));
      } else {
        setError(detail || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, background: 'var(--bg-color)' }}>
      <Container maxWidth="md">
        <Paper className="pinterest-card" elevation={0}>
          <Typography variant="h4" gutterBottom className="brand-title" align="center" color="var(--dark-grey)">
            Employee Registration
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Create your account for the GEB Portal
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {googleData && <Alert severity="info" sx={{ mb: 3 }}>Continuing registration with Google Account: {googleData.email}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="fluid-grid">
              <div>
                <TextField fullWidth label="Full Name" {...register('full_name', { required: 'Full name is required' })} error={!!errors.full_name} helperText={errors.full_name?.message} />
              </div>
              <div>
                <TextField fullWidth label="Username" {...register('username')} />
              </div>
              <div>
                <TextField fullWidth label="Email Address" type="email" {...register('email', { required: 'Email is required' })} error={!!errors.email} helperText={errors.email?.message} disabled={!!googleData} />
              </div>
              <div>
                <TextField fullWidth label="Phone Number" {...register('phone_number')} />
              </div>
              
              {!googleData && (
                <>
                  <div>
                    <TextField fullWidth label="Password" type="password" {...register('password', { required: 'Password is required' })} error={!!errors.password} helperText={errors.password?.message} />
                  </div>
                  <div>
                    <TextField fullWidth label="Confirm Password" type="password" {...register('confirm_password', { 
                      required: 'Please confirm your password',
                      validate: (val) => {
                        if (watch('password') != val) {
                          return "Your passwords do no match";
                        }
                      }
                    })} error={!!errors.confirm_password} helperText={errors.confirm_password?.message} />
                  </div>
                </>
              )}

              <div className="col-span-full">
                <Button type="submit" className="btn-pill" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                </Button>
                <Box textAlign="center" mt={2}>
                  <Link to="/" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
                    Back to Login
                  </Link>
                </Box>
              </div>
            </div>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmployeeRegistrationPage;
