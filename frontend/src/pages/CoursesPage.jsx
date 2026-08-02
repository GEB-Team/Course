import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, 
  Button, Chip, LinearProgress, Tabs, Tab, Paper, Divider 
} from '@mui/material';
import { MenuBook, PlayCircle, CheckCircle, AutoGraph, School } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';

const courseData = [
  {
    id: '1',
    name: 'Government Office Procedures & E-Governance',
    category: 'Administration',
    duration: '4 Weeks',
    level: 'Intermediate',
    progress: 75,
    status: 'In Progress',
    description: 'Learn modern digital workplace standards, government e-office systems, and public records security.'
  },
  {
    id: '2',
    name: 'Digital File Management & Cyber Compliance',
    category: 'IT & Security',
    duration: '3 Weeks',
    level: 'Beginner',
    progress: 100,
    status: 'Completed',
    description: 'Guidelines for managing sensitive governmental records and compliance protocols.'
  },
  {
    id: '3',
    name: 'Public Service Ethics & Regulatory Frameworks',
    category: 'Compliance',
    duration: '2 Weeks',
    level: 'Advanced',
    progress: 30,
    status: 'In Progress',
    description: 'Comprehensive study of public service codes, transparency rules, and ethics standard operating procedures.'
  },
  {
    id: '4',
    name: 'Executive Leadership & Project Management in Public Sector',
    category: 'Leadership',
    duration: '6 Weeks',
    level: 'Advanced',
    progress: 0,
    status: 'Available',
    description: 'Strategic planning, resource allocation, and team leadership across government departments.'
  },
  {
    id: '5',
    name: 'AI & Data-Driven Governance for Modern Civil Services',
    category: 'Technology',
    duration: '5 Weeks',
    level: 'Intermediate',
    progress: 0,
    status: 'Available',
    description: 'Leveraging AI tools, analytics, and intelligent automation for citizen service delivery.'
  }
];

const CoursesPage = ({ initialTab = 0 }) => {
  const [tab, setTab] = useState(initialTab);
  const [courses, setCourses] = useState(courseData);

  const handleEnroll = (id) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'In Progress', progress: 5 } : c));
    alert('Successfully enrolled in course!');
  };

  const filteredCourses = () => {
    if (tab === 0) return courses; // All/Register
    if (tab === 1) return courses.filter(c => c.status === 'In Progress'); // Learning Module
    if (tab === 2) return courses.filter(c => c.status === 'Completed' || c.status === 'In Progress'); // Progress
    return courses;
  };

  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Course Management & Learning Portal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse government-certified training modules, enroll in recommended courses, and track learning progress.
          </Typography>
        </Box>

        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} indicatorColor="primary" textColor="primary">
            <Tab icon={<School />} iconPosition="start" label="Course Catalog & Registration" />
            <Tab icon={<PlayCircle />} iconPosition="start" label="Active Learning Module" />
            <Tab icon={<AutoGraph />} iconPosition="start" label="Course Progress Tracker" />
          </Tabs>
        </Paper>

        <Grid container spacing={3}>
          {filteredCourses().map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 3, bgcolor: 'primary.dark', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Chip label={course.category} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold" lineHeight={1.3}>
                      {course.name}
                    </Typography>
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {course.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={course.duration} size="small" variant="outlined" />
                      <Chip label={course.level} size="small" variant="outlined" />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    {course.status !== 'Available' && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Progress</Typography>
                          <Typography variant="caption" fontWeight="bold">{course.progress}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={course.progress} 
                          color={course.progress === 100 ? 'success' : 'primary'}
                          sx={{ height: 8, borderRadius: 4 }} 
                        />
                      </Box>
                    )}

                    {course.status === 'Available' ? (
                      <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={() => handleEnroll(course.id)}
                      >
                        Enroll Now
                      </Button>
                    ) : course.status === 'Completed' ? (
                      <Button 
                        variant="outlined" 
                        color="success" 
                        fullWidth 
                        startIcon={<CheckCircle />}
                      >
                        Completed (View Certificate)
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        fullWidth 
                        startIcon={<PlayCircle />}
                      >
                        Continue Learning
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default CoursesPage;
