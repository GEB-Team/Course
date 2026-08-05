import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Button, Chip } from '@mui/material';
import { Sparkles, TrendingUp, Compass, Award, ArrowRight, Lightbulb, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AIRecommendationsTab = ({ record }) => {
  const navigate = useNavigate();
  if (!record) return null;
  const recs = record.ai_recommendations || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Banner with AI theme */}
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #1E1B4B 0%, #1E293B 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 24px rgba(30, 27, 75, 0.25)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Sparkles size={24} color="#A78BFA" />
          <Typography variant="h5" fontWeight={800} color="#F5F3FF">
            AI Service Record Insights & Career Advisory
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#C4B5FD', maxWidth: 800 }}>
          Synthesized analysis based on your current cadre positioning ({record.employee_category}), departmental mandate, and upcoming 2026 public infrastructure requirements.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {recs.map((rec, idx) => (
          <Grid item xs={12} md={6} key={idx}>
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
                  borderColor: '#8B5CF6',
                  boxShadow: '0 8px 24px rgba(139, 92, 246, 0.08)'
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip
                    icon={<Sparkles size={12} color="#7C3AED" />}
                    label={rec.category}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(124, 58, 237, 0.08)',
                      color: '#7C3AED',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      border: '1px solid rgba(124, 58, 237, 0.2)'
                    }}
                  />
                  <Chip
                    label={rec.impact}
                    size="small"
                    color={rec.impact.includes('High') ? 'error' : rec.impact.includes('Promotion') ? 'success' : 'primary'}
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                </Box>

                <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                  {rec.title}
                </Typography>

                <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Lightbulb size={16} color="#D97706" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      <strong style={{ color: '#0F172A' }}>AI Rationale:</strong> {rec.reason}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                  Target Competency: <span style={{ color: '#2563EB' }}>{rec.target_skill}</span>
                </Typography>
              </Box>

              <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid #F1F5F9' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  endIcon={<ArrowRight size={14} />}
                  onClick={() => navigate('/recommendations')}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {rec.action_label}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default AIRecommendationsTab;
