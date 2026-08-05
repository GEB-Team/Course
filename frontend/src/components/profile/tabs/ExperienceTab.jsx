import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip } from '@mui/material';
import { Briefcase, Building2, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ExperienceTab = ({ record }) => {
  if (!record) return null;
  const history = record.experience_history || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Professional Experience & Employment Timeline
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Recognized public and private engineering service records approved by the Board.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            {/* Timeline Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main' }}>
                <Briefcase size={24} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Total Cumulative Service: {record.experience_display}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Complete chronological progression across authorized organizations.
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {/* Interactive Timeline */}
            <Box sx={{ position: 'relative', pl: { xs: 3, sm: 4 }, borderLeft: '3px solid #E2E8F0', ml: 1 }}>
              {history.map((exp, idx) => (
                <Box key={exp.id || idx} sx={{ mb: 4, position: 'relative' }}>
                  {/* Timeline dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: { xs: -33, sm: -41 },
                      top: 4,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: exp.is_current ? '#2563EB' : '#94A3B8',
                      border: '4px solid #FFFFFF',
                      boxShadow: '0 0 0 2px #CBD5E1'
                    }}
                  />

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      border: '1px solid',
                      borderColor: exp.is_current ? 'primary.light' : '#E2E8F0',
                      bgcolor: exp.is_current ? 'rgba(37, 99, 235, 0.02)' : '#FAFAFA'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                          {exp.designation}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600}>
                          {exp.organization_name} • <span style={{ color: '#64748B' }}>{exp.department}</span>
                        </Typography>
                      </Box>
                      <Chip
                        label={exp.is_current ? 'Current Posting' : `${exp.start_date} – ${exp.end_date}`}
                        size="small"
                        color={exp.is_current ? 'primary' : 'default'}
                        variant={exp.is_current ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    {exp.role_description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.6 }}>
                        {exp.role_description}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default ExperienceTab;
