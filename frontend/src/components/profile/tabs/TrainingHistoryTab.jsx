import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { GraduationCap, Calendar, Clock, MapPin, CheckCircle2, UserCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const TrainingHistoryTab = ({ record }) => {
  if (!record) return null;
  const trainings = record.training_history || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Mandatory & Executive Training History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completed national workshops, executive leadership academies, and technical masterclasses.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {trainings.map((t, idx) => (
          <Grid item xs={12} key={t.id || idx}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main' }}>
                    <GraduationCap size={24} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {t.training_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                      <span>Lead Trainer: <strong>{t.trainer_name}</strong></span> • 
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {t.venue}</span>
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={<Award size={14} />}
                  label={t.result_grade}
                  color="success"
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    Training Date
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.3 }}>
                    {t.training_date}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    Total Duration
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.3 }}>
                    {t.duration}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    Attendance Record
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main" sx={{ mt: 0.3 }}>
                    {t.attendance_status}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    Service Record Credit
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ mt: 0.3 }}>
                    Approved & Attested
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default TrainingHistoryTab;
