import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Avatar, Button, LinearProgress, List, ListItem, ListItemText, ListItemAvatar, Divider, Chip } from '@mui/material';
import { 
  MenuBook, CheckCircle, HourglassEmpty, WorkspacePremium, 
  Group, NotificationsActive, Payment, Download, 
  Event, Campaign, SupportAgent, ChevronRight
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const SummaryCards = ({ stats }) => {
  const cards = [
    { title: 'Registered Courses', count: stats?.registered_courses || 0, icon: <MenuBook />, color: '#38BDF8' },
    { title: 'Completed Courses', count: stats?.completed_courses || 0, icon: <CheckCircle />, color: '#10B981' },
    { title: 'Pending Courses', count: stats?.pending_courses || 0, icon: <HourglassEmpty />, color: '#F59E0B' },
    { title: 'Certificates Earned', count: stats?.certificates_earned || 0, icon: <WorkspacePremium />, color: '#8B5CF6' },
    { title: 'Training Sessions', count: stats?.training_sessions || 0, icon: <Group />, color: '#EC4899' },
    { title: 'Pending Notifications', count: stats?.pending_notifications || 0, icon: <NotificationsActive />, color: '#EF4444' },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <MotionCard 
            variants={cardVariants} 
            initial="hidden" 
            animate="visible" 
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            sx={{ borderRadius: 3, height: '100%' }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: `${item.color}20`, color: item.color, width: 56, height: 56, mr: 2 }}>
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">{item.count}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>{item.title}</Typography>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      ))}
    </Grid>
  );
};

export const DocumentStatusCard = ({ user }) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>Document Verification</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">Status</Typography>
        <Chip 
          label={user?.verification_status || 'Pending'} 
          color={user?.verification_status === 'Verified' ? 'success' : 'warning'} 
          size="small" 
        />
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Registration Date: {new Date(user?.registration_date).toLocaleDateString()}
      </Typography>
      <Button variant="outlined" fullWidth size="small" endIcon={<ChevronRight />}>
        View Uploaded Documents
      </Button>
    </CardContent>
  </Card>
);

export const CourseProgress = ({ courses }) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>Course Progress</Typography>
      {courses?.map((course) => (
        <Box key={course.id} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>{course.name}</Typography>
            <Typography variant="body2" color="primary">{course.completion_percentage}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={course.completion_percentage} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Estimated Completion: {new Date(course.estimated_completion_date).toLocaleDateString()}
          </Typography>
        </Box>
      ))}
    </CardContent>
  </Card>
);

export const AIRecommendedCourses = ({ recommendations }) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center">
        <Lightbulb sx={{ color: '#F59E0B', mr: 1 }} /> AI Recommended
      </Typography>
      <List disablePadding>
        {recommendations?.map((course, index) => (
          <React.Fragment key={course.id}>
            <ListItem alignItems="flex-start" disableGutters>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight={600}>{course.name}</Typography>}
                secondary={
                  <React.Fragment>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                      {course.reason}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={course.difficulty_level} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label={course.estimated_duration} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Box>
                  </React.Fragment>
                }
              />
              <Button size="small" variant="contained" sx={{ mt: 1 }}>Enroll</Button>
            </ListItem>
            {index < recommendations.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export const UpcomingTraining = ({ trainings }) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>Upcoming Training</Typography>
      <List disablePadding>
        {trainings?.map((training, index) => (
          <React.Fragment key={training.id}>
            <ListItem disableGutters>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}><Event /></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight={600}>{training.name}</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {new Date(training.date).toLocaleDateString()} • {training.time} • {training.venue}
                  </Typography>
                }
              />
              <Button size="small" color="secondary" variant="outlined">Join</Button>
            </ListItem>
            {index < trainings.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export const CertificationSummary = ({ certificates }) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>Certificates Earned</Typography>
      <List disablePadding>
        {certificates?.map((cert, index) => (
          <React.Fragment key={cert.id}>
            <ListItem disableGutters>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.light' }}><WorkspacePremium /></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight={600}>{cert.name}</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Issued: {new Date(cert.issue_date).toLocaleDateString()} • ID: {cert.certificate_number}
                  </Typography>
                }
              />
              <IconButton size="small" color="primary"><Download /></IconButton>
            </ListItem>
            {index < certificates.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export const ProfileSummary = ({ user }) => (
  <Card sx={{ borderRadius: 3, height: '100%', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white' }}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 4 }}>
      <Avatar src={user?.profile_picture} sx={{ width: 80, height: 80, mb: 2, border: '3px solid #38BDF8' }} />
      <Typography variant="h6" fontWeight="bold">{user?.full_name}</Typography>
      <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>{user?.designation} • {user?.department}</Typography>
      
      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption">Profile Completion</Typography>
          <Typography variant="caption">{user?.profile_completion}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={user?.profile_completion} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#38BDF8' } }} />
      </Box>
    </CardContent>
  </Card>
);

export const QuickActions = () => {
  const actions = [
    { label: 'Upload Documents', icon: <Download />, color: 'primary' },
    { label: 'Register Course', icon: <AppRegistration />, color: 'secondary' },
    { label: 'Start Learning', icon: <MenuBook />, color: 'success' },
    { label: 'Pay Fees', icon: <Payment />, color: 'warning' }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>Quick Actions</Typography>
        <Grid container spacing={2}>
          {actions.map((action, idx) => (
            <Grid item xs={6} key={idx}>
              <Button 
                variant="outlined" 
                color={action.color} 
                fullWidth 
                startIcon={action.icon}
                sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2, textTransform: 'none' }}
              >
                {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export const RecentActivities = ({ activities }) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>Recent Activities</Typography>
      <List disablePadding>
        {activities?.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem disableGutters>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', mr: 2 }} />
              <ListItemText
                primary={<Typography variant="body2">{activity.action}</Typography>}
                secondary={<Typography variant="caption" color="text.secondary">{new Date(activity.created_at).toLocaleString()}</Typography>}
              />
            </ListItem>
            {index < activities.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export const Announcements = ({ announcements }) => (
  <Card sx={{ borderRadius: 3, height: '100%', bgcolor: '#EFF6FF' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2} color="#1E3A8A" display="flex" alignItems="center">
        <Campaign sx={{ mr: 1 }} /> Announcements
      </Typography>
      {announcements?.map((ann, idx) => (
        <Box key={ann.id} sx={{ mb: idx < announcements.length - 1 ? 2 : 0, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>{ann.title}</Typography>
            <Chip label={ann.type} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
          </Box>
          <Typography variant="caption" color="text.secondary">{new Date(ann.created_at).toLocaleDateString()}</Typography>
        </Box>
      ))}
    </CardContent>
  </Card>
);

export const PaymentSummary = ({ payments }) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>Payment Summary</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1, p: 2, bgcolor: '#FEF2F2', borderRadius: 2 }}>
          <Typography variant="caption" color="error">Pending</Typography>
          <Typography variant="h5" fontWeight="bold" color="error.dark">${payments?.pending}</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, bgcolor: '#F0FDF4', borderRadius: 2 }}>
          <Typography variant="caption" color="success.main">Completed</Typography>
          <Typography variant="h5" fontWeight="bold" color="success.dark">${payments?.completed}</Typography>
        </Box>
      </Box>
      <Button variant="contained" color="primary" fullWidth>Pay Now</Button>
    </CardContent>
  </Card>
);
