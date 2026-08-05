import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Divider, Button, 
  Switch, FormControlLabel, TextField, MenuItem, Alert 
} from '@mui/material';
import { Settings, Shield, Lock, Globe, Bell, Eye, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

const SettingsTab = ({ record, onSettingsUpdated }) => {
  const [settings, setSettings] = useState({
    language_preference: 'English (US)',
    two_factor_enabled: true,
    email_notifications: true,
    sms_notifications: false,
    privacy_contact_masked: false
  });

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (record?.settings) {
      setSettings({
        language_preference: record.settings.language_preference || 'English (US)',
        two_factor_enabled: record.settings.two_factor_enabled ?? true,
        email_notifications: record.settings.email_notifications ?? true,
        sms_notifications: record.settings.sms_notifications ?? false,
        privacy_contact_masked: record.settings.privacy_contact_masked ?? false
      });
    }
  }, [record]);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageChange = (e) => {
    setSettings(prev => ({ ...prev, language_preference: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwords.new_password) {
      if (passwords.new_password !== passwords.confirm_password) {
        setError('New passwords do not match.');
        setLoading(false);
        return;
      }
      if (!passwords.current_password) {
        setError('Current password is required to set a new password.');
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        ...settings,
        current_password: passwords.current_password || null,
        new_password: passwords.new_password || null
      };

      await api.put('/profile/settings', payload);
      setSuccess('Account settings & preferences saved successfully!');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
      setLoading(false);
      if (onSettingsUpdated) onSettingsUpdated();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update settings.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Security, Preferences & Privacy Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure two-factor authentication, language preferences, notification dispatches, and access security.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSaveSettings}>
        <Grid container spacing={3}>
          {/* Security & 2FA */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main', display: 'flex' }}>
                  <Shield size={20} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Authentication & Security
                </Typography>
              </Box>
              <Divider sx={{ mb: 2.5 }} />

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.two_factor_enabled}
                      onChange={() => handleToggle('two_factor_enabled')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Two-Factor Authentication (2FA)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Require secondary OTP verification upon every government portal sign-in.
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Change Account Password
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="Current Password"
                    name="current_password"
                    value={passwords.current_password}
                    onChange={handlePasswordChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="New Password"
                    name="new_password"
                    value={passwords.new_password}
                    onChange={handlePasswordChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="Confirm New Password"
                    name="confirm_password"
                    value={passwords.confirm_password}
                    onChange={handlePasswordChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Preferences & Privacy */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.08)', color: 'success.main', display: 'flex' }}>
                  <Globe size={20} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Language & Communications
                </Typography>
              </Box>
              <Divider sx={{ mb: 2.5 }} />

              <Box sx={{ mb: 3 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Official Portal Language"
                  value={settings.language_preference}
                  onChange={handleLanguageChange}
                >
                  <MenuItem value="English (US)">English (National Standard)</MenuItem>
                  <MenuItem value="Hindi">हिंदी (Hindi)</MenuItem>
                  <MenuItem value="Tamil">தமிழ் (Tamil)</MenuItem>
                  <MenuItem value="Telugu">తెలుగు (Telugu)</MenuItem>
                  <MenuItem value="Marathi">मराठी (Marathi)</MenuItem>
                </TextField>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Notification Preferences
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.email_notifications}
                      onChange={() => handleToggle('email_notifications')}
                      color="primary"
                    />
                  }
                  label="Receive Email alerts for course milestones & approvals"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sms_notifications}
                      onChange={() => handleToggle('sms_notifications')}
                      color="primary"
                    />
                  }
                  label="Receive SMS alerts for urgent Board gazette notices"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Directory Privacy
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy_contact_masked}
                    onChange={() => handleToggle('privacy_contact_masked')}
                    color="primary"
                  />
                }
                label="Mask personal phone number in the public cadre directory"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={<Save size={18} />}
              sx={{ px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              {loading ? 'Saving Preferences...' : 'Save All Settings'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </motion.div>
  );
};

export default SettingsTab;
