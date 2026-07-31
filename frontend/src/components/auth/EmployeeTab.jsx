import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Divider, Link as MuiLink, Alert, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const EmployeeTab = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loginGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await login(data.email, data.password, 'EMPLOYEE');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      await loginGoogle(credentialResponse.credential, 'EMPLOYEE');
    } catch (err) {
      if (err.message) setError(err.message);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed. Please try again.');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      
      <Box className="google-btn-wrapper" sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          shape="rectangular"
          theme="outline"
          size="large"
          text="continue_with"
        />
      </Box>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="var(--dark-grey)">OR</Typography>
      </Divider>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">✉️</InputAdornment>,
          }}
          {...register('email', { required: 'Email is required' })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">🔑</InputAdornment>,
          }}
          {...register('password', { required: 'Password is required' })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
          <MuiLink component={Link} to="#" variant="body2" color="secondary" underline="hover" fontWeight="500">
            Forgot Password?
          </MuiLink>
        </Box>

        <Button 
          type="submit" 
          className="btn-pill"
          fullWidth 
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="var(--dark-grey)">
          Don't have an account?{' '}
          <MuiLink component={Link} to="/employee/register" color="secondary" fontWeight={600} underline="hover">
            Register Now
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default EmployeeTab;
