import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, 
  Switch, FormControlLabel, Divider, Alert 
} from '@mui/material';
import { Settings, Save } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Account & Security Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account preferences, notification channels, and security settings.
          </Typography>
        </Box>

        {saved && <Alert severity="success" sx={{ mb: 3 }}>Settings saved successfully!</Alert>}

        <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Personal Preferences
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Full Name" fullWidth defaultValue={user?.full_name || 'Admin User'} size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email Address" fullWidth defaultValue={user?.email || 'admin@geb.gov'} size="small" disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone Number" fullWidth defaultValue={user?.phone_number || '+91 98765 43210'} size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Language Preference" fullWidth defaultValue="English (US)" size="small" />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Notifications & Alerts
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel 
              control={<Switch checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} color="primary" />} 
              label="Email Notifications (Verification updates, Course alerts)" 
            />
            <FormControlLabel 
              control={<Switch checked={smsNotifs} onChange={(e) => setSmsNotifs(e.target.checked)} color="primary" />} 
              label="SMS Alerts for urgent deadlines" 
            />
          </Box>
        </Paper>

        <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Security & Authentication
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControlLabel 
            control={<Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} color="primary" />} 
            label="Two-Factor Authentication (2FA) for login verification" 
          />
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<Save />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default SettingsPage;
