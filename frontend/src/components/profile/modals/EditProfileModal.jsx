import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Grid, Typography, MenuItem, 
  Alert, Box, Divider, IconButton 
} from '@mui/material';
import { X, Save, UserCheck } from 'lucide-react';
import api from '../../../services/api';

const EditProfileModal = ({ open, onClose, record, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: 'Male',
    nationality: 'Indian',
    blood_group: 'O+',
    phone_number: '',
    alternate_phone: '',
    residential_address: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (record?.personal_info) {
      const p = record.personal_info;
      setFormData({
        full_name: p.full_name || record.full_name || '',
        date_of_birth: p.date_of_birth || '1992-05-14',
        gender: p.gender || 'Male',
        nationality: p.nationality || 'Indian',
        blood_group: p.blood_group || 'O+',
        phone_number: p.phone_number || '',
        alternate_phone: p.alternate_phone || '',
        residential_address: p.residential_address || '',
        emergency_contact_name: p.emergency_contact_name || '',
        emergency_contact_phone: p.emergency_contact_phone || ''
      });
    }
  }, [record, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/profile/personal', formData);
      setSuccess('Personal details updated successfully!');
      setTimeout(() => {
        onProfileUpdated();
        onClose();
      }, 700);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update personal details.');
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <UserCheck size={24} color="#2563EB" />
          <Typography variant="h6" fontWeight={700}>
            Edit Digital Service Record • Personal Information
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <Divider />

      <form onSubmit={handleSave}>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Core Identity
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Full Name" 
                name="full_name" 
                value={formData.full_name} 
                onChange={handleChange} 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                type="date" 
                label="Date of Birth" 
                name="date_of_birth" 
                value={formData.date_of_birth} 
                onChange={handleChange} 
                InputLabelProps={{ shrink: true }}
                required 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                select 
                fullWidth 
                label="Gender" 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Nationality" 
                name="nationality" 
                value={formData.nationality} 
                onChange={handleChange} 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                select 
                fullWidth 
                label="Blood Group" 
                name="blood_group" 
                value={formData.blood_group} 
                onChange={handleChange}
              >
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Contact & Residential Details
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Primary Phone Number" 
                name="phone_number" 
                value={formData.phone_number} 
                onChange={handleChange} 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Alternate Contact Number" 
                name="alternate_phone" 
                value={formData.alternate_phone} 
                onChange={handleChange} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                multiline 
                rows={2} 
                label="Residential Address" 
                name="residential_address" 
                value={formData.residential_address} 
                onChange={handleChange} 
                required 
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Emergency Contact Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Emergency Contact Name & Relationship" 
                name="emergency_contact_name" 
                value={formData.emergency_contact_name} 
                onChange={handleChange} 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Emergency Contact Phone" 
                name="emergency_contact_phone" 
                value={formData.emergency_contact_phone} 
                onChange={handleChange} 
                required 
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
            startIcon={<Save size={16} />}
            sx={{ px: 3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            {loading ? 'Saving Changes...' : 'Save & Update Record'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileModal;
