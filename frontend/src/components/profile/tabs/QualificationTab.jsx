import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip } from '@mui/material';
import { GraduationCap, Award, BookOpen, CheckCircle2, School } from 'lucide-react';
import { motion } from 'framer-motion';

const QualificationTab = ({ record }) => {
  if (!record) return null;
  const quals = record.qualifications || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Academic Qualifications & Accreditations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Certified university degrees, specializations, and professional engineering credentials.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {quals.map((q, idx) => (
          <Grid item xs={12} key={q.id || idx}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main' }}>
                    <School size={26} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={800} color="text.primary">
                      {q.highest_qualification}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {q.university}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  icon={<CheckCircle2 size={14} />} 
                  label="Degree Attested & Verified" 
                  color="success" 
                  size="small" 
                  sx={{ fontWeight: 700 }} 
                />
              </Box>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    Specialization / Cadre Discipline
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="primary.main" sx={{ mt: 0.5 }}>
                    {q.specialization}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    Year of Passing
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                    {q.passing_year}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    CGPA / Cumulative Grade
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="success.main" sx={{ mt: 0.5 }}>
                    {q.cgpa_percentage}
                  </Typography>
                </Grid>

                {q.professional_certifications && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" display="block" sx={{ mb: 1 }}>
                      Professional Engineering Credentials & Accreditations
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {q.professional_certifications.split(',').map((cert, cIdx) => (
                        <Chip
                          key={cIdx}
                          icon={<Award size={14} />}
                          label={cert.trim()}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(56, 189, 248, 0.1)', 
                            color: '#0284C7', 
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            fontWeight: 600 
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default QualificationTab;
