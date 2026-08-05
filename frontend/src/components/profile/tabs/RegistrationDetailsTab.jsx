import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip } from '@mui/material';
import { Award, ShieldCheck, Calendar, Clock, CheckCircle2, FileText, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const RegistrationDetailsTab = ({ record }) => {
  if (!record) return null;
  const r = record.registration_details || {};
  const history = r.history || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Board Registration & License Credentials
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Official statutory registration record with the Government Engineering Board.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Core Registration Card */}
        <Grid item xs={12} md={7}>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main', display: 'flex' }}>
                  <Award size={20} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Board Registration Record
                </Typography>
              </Box>
              <Chip 
                label={r.current_registration_status || "Approved"} 
                color="success" 
                size="small" 
                sx={{ fontWeight: 700, borderRadius: 2 }}
              />
            </Box>
            <Divider sx={{ mb: 2.5 }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Registration Number
                </Typography>
                <Typography variant="body1" fontWeight={800} color="primary.main" sx={{ mt: 0.3 }}>
                  {r.registration_number}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  License Classification
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                  {r.registration_category}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Initial Registration Date
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                  {r.registration_date}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  License Expiry Date
                </Typography>
                <Typography variant="body1" fontWeight={600} color="success.main" sx={{ mt: 0.3 }}>
                  {r.registration_expiry} (Active)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Verification Officer
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                  {r.verification_officer}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Verification Completed On
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                  {r.verification_date}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Registration Audit Timeline */}
        <Grid item xs={12} md={5}>
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
                <Clock size={20} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Registration Audit Trail
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ position: 'relative', pl: 3, borderLeft: '2px solid #E2E8F0', ml: 1 }}>
              {history.map((item, idx) => (
                <Box key={idx} sx={{ mb: 2.5, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -31,
                      top: 2,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: idx === 0 ? '#2563EB' : '#10B981',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 0 0 2px #E2E8F0'
                    }}
                  />
                  <Typography variant="caption" color="primary" fontWeight={700}>
                    {item.date}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.2 }}>
                    {item.event}
                  </Typography>
                  <Chip 
                    label={item.status} 
                    size="small" 
                    sx={{ mt: 0.5, height: 20, fontSize: '0.68rem', fontWeight: 600 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default RegistrationDetailsTab;
