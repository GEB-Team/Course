import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Alert, AlertTitle, Divider, MenuItem } from '@mui/material';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const DataReview = ({ extractionResult, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    applicant_type: 'CITIZEN',
    experience_years: 0,
    qualification: '',
    department: '',
    designation: '',
    residence_number: '',
    residence_expiry_date: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (extractionResult?.extracted_data) {
      const data = extractionResult.extracted_data;
      setFormData(prev => ({
        ...prev,
        full_name: data.full_name || '',
        experience_years: data.experience_years || 0,
        qualification: data.qualification || '',
        department: data.department || '',
        designation: data.designation || '',
        residence_number: data.residence_number || '',
        residence_expiry_date: data.residence_expiry_date || ''
      }));
    }
  }, [extractionResult]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        document_id: extractionResult.document_id,
        ...formData
      };
      
      // Ensure experience_years is int
      payload.experience_years = parseInt(payload.experience_years, 10) || 0;

      const response = await api.post('/onboarding/submit', payload);
      onSubmit(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit reviewed data.');
      setSubmitting(false);
    }
  };

  const { confidence_score, validation_status, uncertain_fields } = extractionResult || {};
  
  const isHighConfidence = confidence_score >= 90;
  const isMediumConfidence = confidence_score >= 60 && confidence_score < 90;

  return (
    <Box sx={{ p: 2 }}>
      <Alert 
        severity={isHighConfidence ? "success" : isMediumConfidence ? "warning" : "error"}
        icon={isHighConfidence ? <CheckCircle /> : <AlertTriangle />}
        sx={{ mb: 4, borderRadius: 2 }}
      >
        <AlertTitle>AI Verification Status: {validation_status}</AlertTitle>
        Confidence Score: <strong>{confidence_score}%</strong>. 
        {uncertain_fields?.length > 0 && ` We had trouble reading: ${uncertain_fields.join(', ')}.`}
        Please review and correct the extracted information below.
      </Alert>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary">Personal Details</Typography>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Applicant Type" name="applicant_type" value={formData.applicant_type} onChange={handleChange} required>
              <MenuItem value="CITIZEN">Citizen</MenuItem>
              <MenuItem value="NON_CITIZEN">Non-Citizen</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Professional Details</Typography>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Experience (Years)" name="experience_years" value={formData.experience_years} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Department" name="department" value={formData.department} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
          </Grid>

          {formData.applicant_type === 'NON_CITIZEN' && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Residency Details</Typography>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Residence Number" name="residence_number" value={formData.residence_number} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Residence Expiry Date" name="residence_expiry_date" value={formData.residence_expiry_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
              </Grid>
            </>
          )}

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large" 
              disabled={submitting}
              sx={{ px: 5, borderRadius: 2 }}
            >
              Confirm & Evaluate Eligibility
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default DataReview;
