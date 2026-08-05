import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Button, Chip, LinearProgress } from '@mui/material';
import { BookOpen, Play, CheckCircle2, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CoursesTab = ({ record }) => {
  const navigate = useNavigate();
  if (!record) return null;
  const courses = record.courses || [];

  const completedCount = courses.filter(c => c.status === 'Completed').length;
  const inProgressCount = courses.filter(c => c.status === 'In Progress').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Continuous Professional Learning & Courses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mandatory government modules, technical upskilling, and compliance courses.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Chip label={`${completedCount} Completed`} color="success" sx={{ fontWeight: 700 }} />
          <Chip label={`${inProgressCount} In Progress`} color="primary" sx={{ fontWeight: 700 }} />
          <Button
            variant="contained"
            startIcon={<BookOpen size={16} />}
            onClick={() => navigate('/courses/register')}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Explore Course Catalog
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course, idx) => (
          <Grid item xs={12} md={6} key={course.id || idx}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Chip
                    label={course.status}
                    size="small"
                    color={course.status === 'Completed' ? 'success' : 'primary'}
                    variant={course.status === 'Completed' ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={12} /> {course.estimated_duration}
                  </Typography>
                </Box>

                <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                  {course.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {course.description || 'Comprehensive module covering government administrative and technical protocols.'}
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      Course Progress
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      {course.completion_percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={course.completion_percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#E2E8F0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: course.completion_percentage === 100 ? '#10B981' : '#2563EB',
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Enrolled: {course.registered_at}
                </Typography>
                <Button
                  variant={course.completion_percentage === 100 ? 'outlined' : 'contained'}
                  color="primary"
                  size="small"
                  startIcon={course.completion_percentage === 100 ? <Award size={14} /> : <Play size={14} />}
                  onClick={() => navigate('/training')}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {course.completion_percentage === 100 ? 'Review Module' : 'Start Learning'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default CoursesTab;
