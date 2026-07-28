import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Container } from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import AIAssistant from '../components/dashboard/AIAssistant';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import { 
  SummaryCards, DocumentStatusCard, CourseProgress, 
  AIRecommendedCourses, UpcomingTraining, CertificationSummary, 
  ProfileSummary, QuickActions, RecentActivities, 
  Announcements, PaymentSummary 
} from '../components/dashboard/Widgets';
import api from '../services/api';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setData(response.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <Typography color="error" variant="h6">Failed to load dashboard data. Please try again later.</Typography>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl" disableGutters>
        
        {/* Dashboard Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Welcome back, {data.user.full_name} 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {data.user.designation} • {data.user.department}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Last Login: {new Date(data.user.last_login).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Summary Cards Row */}
        <Box sx={{ mb: 4 }}>
          <SummaryCards stats={data.stats} />
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          
          {/* Left Column (8 units) */}
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DashboardCharts chartsData={data.charts} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CourseProgress courses={data.course_progress} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DocumentStatusCard user={data.user} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CertificationSummary certificates={data.certificates} />
              </Grid>
              <Grid item xs={12} md={6}>
                <PaymentSummary payments={data.payments} />
              </Grid>
              <Grid item xs={12}>
                <AIRecommendedCourses recommendations={data.ai_recommended_courses} />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column (4 units) */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProfileSummary user={data.user} />
              </Grid>
              <Grid item xs={12}>
                <QuickActions />
              </Grid>
              <Grid item xs={12}>
                <UpcomingTraining trainings={data.upcoming_training} />
              </Grid>
              <Grid item xs={12}>
                <Announcements announcements={data.announcements} />
              </Grid>
              <Grid item xs={12}>
                <RecentActivities activities={data.recent_activities} />
              </Grid>
            </Grid>
          </Grid>

        </Grid>

        <AIAssistant />
      </Container>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
