import React from 'react';
import { 
  Box, Typography, Avatar, Button, Chip, Grid, Paper, 
  CircularProgress, Tooltip, Divider, useTheme, useMediaQuery 
} from '@mui/material';
import { 
  Edit3, CreditCard, QrCode, Printer, ShieldCheck, 
  Briefcase, MapPin, Calendar, Award, Building, 
  CheckCircle2, AlertCircle, FileCheck, Hash
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileBanner = ({ 
  record, 
  onEditProfile, 
  onOpenIdCard, 
  onOpenQrCode, 
  onPrint 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (!record) return null;

  const completion = record.profile_completion_percentage || 92;

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          mb: 3,
          background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
          color: '#FFFFFF',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)'
        }}
      >
        {/* Top Government Watermark Header */}
        <Box 
          sx={{ 
            px: { xs: 2, md: 4 }, 
            py: 1.2, 
            background: 'linear-gradient(90deg, #1E3A8A 0%, #2563EB 50%, #1E3A8A 100%)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShieldCheck size={18} color="#38BDF8" />
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#F8FAFC' }}>
              Government Engineering Board • Digital Service Record (DSR)
            </Typography>
          </Box>
          <Chip 
            size="small"
            icon={<CheckCircle2 size={14} color="#10B981" />}
            label="OFFICIAL & VERIFIED"
            sx={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.18)', 
              color: '#34D399', 
              fontWeight: 700, 
              fontSize: '0.7rem',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }} 
          />
        </Box>

        {/* Main Banner Content */}
        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Grid container spacing={3} alignItems="center">
            {/* Left: Avatar & Badges */}
            <Grid item xs={12} sm={4} md={2.5} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={record.profile_picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                  alt={record.full_name}
                  sx={{
                    width: { xs: 110, md: 130 },
                    height: { xs: 110, md: 130 },
                    border: '4px solid #38BDF8',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
                    mx: { xs: 'auto', sm: 0 }
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    bgcolor: '#10B981',
                    borderRadius: '50%',
                    p: 0.6,
                    border: '2px solid #0F172A',
                    display: 'flex'
                  }}
                >
                  <FileCheck size={16} color="#FFFFFF" />
                </Box>
              </Box>
            </Grid>

            {/* Middle: Core Information */}
            <Grid item xs={12} sm={8} md={6}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 0.5 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.5, color: '#F8FAFC', fontSize: { xs: '1.5rem', md: '1.9rem' } }}>
                    {record.full_name}
                  </Typography>
                  <Chip 
                    label={record.applicant_type || "CITIZEN"} 
                    size="small" 
                    sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)' }}
                  />
                  <Chip 
                    label={record.employee_category || "Professional"} 
                    size="small" 
                    sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontWeight: 700, border: '1px solid rgba(245, 158, 11, 0.3)' }}
                  />
                </Box>

                <Typography variant="h6" sx={{ color: '#94A3B8', fontWeight: 500, fontSize: { xs: '0.95rem', md: '1.1rem' }, mb: 1.5 }}>
                  {record.designation} • <span style={{ color: '#38BDF8' }}>{record.department}</span>
                </Typography>

                {/* Metadata Pills */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#CBD5E1', fontSize: '0.85rem' }}>
                      <Hash size={16} color="#38BDF8" />
                      <Typography variant="body2">Emp ID: <strong style={{ color: '#F8FAFC' }}>{record.employee_id}</strong></Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#CBD5E1', fontSize: '0.85rem' }}>
                      <Award size={16} color="#38BDF8" />
                      <Typography variant="body2">Reg No: <strong style={{ color: '#F8FAFC' }}>{record.registration_number}</strong></Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#CBD5E1', fontSize: '0.85rem' }}>
                      <Briefcase size={16} color="#38BDF8" />
                      <Typography variant="body2">Experience: <strong style={{ color: '#F8FAFC' }}>{record.experience_display}</strong></Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#CBD5E1', fontSize: '0.85rem' }}>
                      <Calendar size={16} color="#38BDF8" />
                      <Typography variant="body2">Joined: <strong style={{ color: '#F8FAFC' }}>{record.joining_date}</strong></Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#CBD5E1', fontSize: '0.85rem' }}>
                      <MapPin size={16} color="#38BDF8" />
                      <Typography variant="body2">Posting: <strong style={{ color: '#F8FAFC' }}>{record.office_location}</strong></Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right: Profile Completion Ring & Quick Stats */}
            <Grid item xs={12} md={3.5}>
              <Box 
                sx={{ 
                  p: 2.5, 
                  borderRadius: 3, 
                  bgcolor: 'rgba(255, 255, 255, 0.04)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5
                }}
              >
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={70}
                    thickness={4.5}
                    sx={{ color: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={completion}
                    size={70}
                    thickness={4.5}
                    sx={{ 
                      color: completion > 85 ? '#10B981' : '#F59E0B', 
                      position: 'absolute', 
                      left: 0 
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" fontWeight={800} sx={{ color: '#FFFFFF', fontSize: '0.85rem' }}>
                      {`${Math.round(completion)}%`}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="#F8FAFC">
                    Service Record Status
                  </Typography>
                  <Typography variant="caption" color="#94A3B8" display="block">
                    {completion >= 90 ? 'All 12 Service Book Dimensions Verified' : 'Complete remaining verification tabs'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip 
                      label={record.verification_status || "Verified"} 
                      size="small" 
                      color="success" 
                      sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                    />
                    <Chip 
                      label={record.registration_status || "Approved"} 
                      size="small" 
                      color="primary" 
                      sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Action Button Toolbar */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1.5, 
              flexWrap: 'wrap', 
              justifyContent: { xs: 'center', sm: 'flex-start' } 
            }}
          >
            <Button
              variant="contained"
              startIcon={<Edit3 size={16} />}
              onClick={onEditProfile}
              sx={{
                bgcolor: '#2563EB',
                '&:hover': { bgcolor: '#1D4ED8' },
                borderRadius: 2,
                px: 2.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              Edit Profile
            </Button>

            <Button
              variant="outlined"
              startIcon={<CreditCard size={16} />}
              onClick={onOpenIdCard}
              sx={{
                color: '#38BDF8',
                borderColor: '#38BDF8',
                '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.1)', borderColor: '#7DD3FC' },
                borderRadius: 2,
                px: 2.5,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Download Employee ID Card
            </Button>

            <Button
              variant="outlined"
              startIcon={<QrCode size={16} />}
              onClick={onOpenQrCode}
              sx={{
                color: '#F8FAFC',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderColor: '#FFFFFF' },
                borderRadius: 2,
                px: 2.5,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              View QR Code
            </Button>

            <Button
              variant="outlined"
              startIcon={<Printer size={16} />}
              onClick={onPrint}
              sx={{
                color: '#CBD5E1',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
                borderRadius: 2,
                px: 2,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Print Profile
            </Button>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ProfileBanner;
