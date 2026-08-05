import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip } from '@mui/material';
import { Activity, Clock, Bell, CheckCircle2, ShieldCheck, FileCheck, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityTimelineTab = ({ record }) => {
  if (!record) return null;
  const activities = record.activity_timeline || [];
  const notifs = record.notifications_summary || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Service Record Activity & Audit Trail
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Immutable chronological ledger of credential events, course achievements, and profile modifications.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left: Activity Timeline */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main', display: 'flex' }}>
                <Activity size={20} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Chronological Service Events
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ position: 'relative', pl: 3.5, borderLeft: '2px solid #E2E8F0', ml: 1 }}>
              {activities.map((act, idx) => (
                <Box key={act.id || idx} sx={{ mb: 3, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -35,
                      top: 2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: '#2563EB',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 0 0 2px #CBD5E1'
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                    {act.created_at}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ mt: 0.3 }}>
                    {act.action}
                  </Typography>
                  <Chip
                    label="Verified & Logged"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ mt: 0.5, height: 20, fontSize: '0.68rem', fontWeight: 600 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right: Recent Notification Summary */}
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
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.08)', color: 'warning.main', display: 'flex' }}>
                <Bell size={20} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Official Notifications
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {notifs.map((n, idx) => (
              <Paper
                key={n.id || idx}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  bgcolor: n.is_read ? '#F8FAFC' : 'rgba(37, 99, 235, 0.04)',
                  border: '1px solid',
                  borderColor: n.is_read ? '#E2E8F0' : 'primary.light'
                }}
              >
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {n.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  {n.created_at}
                </Typography>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default ActivityTimelineTab;
