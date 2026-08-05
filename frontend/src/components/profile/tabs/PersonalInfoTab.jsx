import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Button, Chip } from '@mui/material';
import { 
  User, Mail, Phone, MapPin, AlertCircle, Heart, 
  Calendar, Globe, Shield, Edit3, CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const InfoCard = ({ icon: Icon, title, items, onEdit }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      height: '100%',
      bgcolor: 'background.paper',
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: 'primary.light',
        boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
      }
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main', display: 'flex' }}>
          <Icon size={20} />
        </Box>
        <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
          {title}
        </Typography>
      </Box>
      {onEdit && (
        <Button 
          size="small" 
          startIcon={<Edit3 size={14} />} 
          onClick={onEdit}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Edit
        </Button>
      )}
    </Box>
    <Divider sx={{ mb: 2 }} />

    <Grid container spacing={2}>
      {items.map((item, idx) => (
        <Grid item xs={12} sm={item.fullWidth ? 12 : 6} key={idx}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" display="block">
            {item.label}
          </Typography>
          <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mt: 0.3, wordBreak: 'break-word' }}>
            {item.value || '—'}
          </Typography>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

const PersonalInfoTab = ({ record, onEdit }) => {
  if (!record) return null;
  const p = record.personal_info || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Personal Information & Demographics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Official civil service demographic record verified by Government Engineering Board.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit3 size={16} />}
          onClick={onEdit}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Edit Personal Details
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Identity & Demographics */}
        <Grid item xs={12} md={6}>
          <InfoCard
            icon={User}
            title="Civil Identity & Demographics"
            items={[
              { label: 'Full Legal Name', value: p.full_name },
              { label: 'Date of Birth', value: p.date_of_birth },
              { label: 'Gender', value: p.gender },
              { label: 'Nationality', value: p.nationality },
              { label: 'Blood Group', value: p.blood_group },
              { label: 'Applicant Category', value: record.applicant_type }
            ]}
          />
        </Grid>

        {/* Contact Details */}
        <Grid item xs={12} md={6}>
          <InfoCard
            icon={Phone}
            title="Contact Information"
            items={[
              { label: 'Official Gov Email', value: record.employment_details?.office_email || record.email },
              { label: 'Personal Email', value: p.email || record.email },
              { label: 'Primary Contact Phone', value: p.phone_number },
              { label: 'Alternate Contact Phone', value: p.alternate_phone || 'None recorded' }
            ]}
          />
        </Grid>

        {/* Residential Address */}
        <Grid item xs={12} md={6}>
          <InfoCard
            icon={MapPin}
            title="Permanent Residential Address"
            items={[
              { label: 'Registered Address', value: p.residential_address, fullWidth: true },
              { label: 'State / Territory', value: 'National Capital Territory of Delhi' },
              { label: 'Postal Code', value: '110001' }
            ]}
          />
        </Grid>

        {/* Emergency Contacts */}
        <Grid item xs={12} md={6}>
          <InfoCard
            icon={Heart}
            title="Emergency Contact & Next of Kin"
            items={[
              { label: 'Primary Contact Person', value: p.emergency_contact_name },
              { label: 'Emergency Telephone', value: p.emergency_contact_phone },
              { label: 'Verification Status', value: 'Verified on Service Record' }
            ]}
          />
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default PersonalInfoTab;
