import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Avatar } from '@mui/material';
import { Lightbulb, AutoAwesome, School, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

const recommendations = [
  {
    title: 'Advanced Public Financial Management',
    tag: 'Role Fit: 96%',
    reason: 'Recommended based on your experience and recent administrative workflow updates.',
    duration: '4 Weeks',
    difficulty: 'Advanced'
  },
  {
    title: 'Digital Signature & Cyber Identity Standards',
    tag: 'Compliance: Mandatory',
    reason: 'Required for all government employees handling authenticated document validations.',
    duration: '2 Weeks',
    difficulty: 'Intermediate'
  },
  {
    title: 'Data Analytics for Policy Decision Making',
    tag: 'Trending: High Impact',
    reason: 'Boost your analytical capabilities for public sector KPI tracking.',
    duration: '5 Weeks',
    difficulty: 'Advanced'
  }
];

const RecommendationsPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AutoAwesome sx={{ color: '#F59E0B' }} />
            AI Career & Learning Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intelligent career progression insights tailored to your verified credentials and government department.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {recommendations.map((r, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 1 }}>
                <CardContent>
                  <Chip label={r.tag} color="primary" size="small" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {r.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {r.reason}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={r.duration} size="small" variant="outlined" />
                    <Chip label={r.difficulty} size="small" variant="outlined" />
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/courses/register')}
                  >
                    Enroll in Track
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default RecommendationsPage;
