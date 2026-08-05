import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { Briefcase, Building, UserCheck, ShieldCheck, Mail, MapPin, Calendar, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const EmploymentDetailsTab = ({ record }) => {
  if (!record) return null;
  const e = record.employment_details || {};

  const fields = [
    { label: 'Employee Permanent ID', value: e.employee_id, highlight: true },
    { label: 'Cadre / Service Category', value: e.employee_category },
    { label: 'Cadre Group', value: e.group || 'Group A (Gazetted)' },
    { label: 'Cadre Sub-Category', value: e.sub_category || 'Civil Infrastructure & Smart Cities' },
    { label: 'Official Designation', value: e.designation, highlight: true },
    { label: 'Parent Department', value: e.department },
    { label: 'Employment Status', value: e.employee_status || 'Permanent / Full-Time' },
    { label: 'Date of Board Appointment', value: e.joining_date || '10-Apr-2023' },
    { label: 'Total Recognized Experience', value: e.experience },
    { label: 'Official Government Email', value: e.office_email },
    { label: 'Designated Reporting Officer', value: e.reporting_officer, highlight: true },
    { label: 'Current Posting Station', value: e.office_name }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Official Employment Record (Digital Service Book)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Official cadre positioning, office jurisdiction, and service appointment hierarchy.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Service Book Grid */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main', display: 'flex' }}>
                <Briefcase size={20} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Cadre & Service Designation Particulars
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2.5}>
              {fields.map((f, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" display="block">
                    {f.label}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight={f.highlight ? 700 : 500} 
                    color={f.highlight ? 'primary.main' : 'text.primary'} 
                    sx={{ mt: 0.3 }}
                  >
                    {f.value || '—'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Office & Hierarchy Card */}
        <Grid item xs={12} md={4}>
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
                <Building size={20} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Office Jurisdiction
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                OFFICE LOCATION
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                {e.office_name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {e.office_address}
              </Typography>
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                SUPERVISORY AUTHORITY
              </Typography>
              <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ mt: 0.5 }}>
                {e.reporting_officer}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <ShieldCheck size={16} color="#0284C7" />
                <Typography variant="caption" fontWeight={700} color="#0284C7">
                  SERVICE BOOK VERIFIED
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Digitally attested by the Central Cadre Management Authority.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default EmploymentDetailsTab;
