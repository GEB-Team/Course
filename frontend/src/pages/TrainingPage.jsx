import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Avatar } from '@mui/material';
import { Event, AccessTime, LocationOn, Person, PlayArrow } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';

const trainings = [
  {
    id: 1,
    title: 'Cybersecurity & Official Data Protection Standards',
    trainer: 'Dr. Sarah Jenkins',
    date: '2026-08-15',
    time: '10:00 AM - 12:30 PM',
    venue: 'Virtual Hall A (Zoom)',
    type: 'Mandatory',
    status: 'Upcoming'
  },
  {
    id: 2,
    title: 'Modern Public Administration SOPs & File Routing',
    trainer: 'Mr. Arvind Sharma',
    date: '2026-08-20',
    time: '02:00 PM - 04:30 PM',
    venue: 'Board Room 4B / Hybrid',
    type: 'General',
    status: 'Upcoming'
  },
  {
    id: 3,
    title: 'AI Verification & Machine-Assisted Workflow Orientation',
    trainer: 'Ms. Emily Vance',
    date: '2026-08-28',
    time: '11:00 AM - 01:00 PM',
    venue: 'Webinar Hall 2',
    type: 'Technical',
    status: 'Registration Open'
  }
];

const TrainingPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Live Training Sessions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join scheduled interactive training webinars and live skill development workshops.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {trainings.map((t) => (
            <Grid item xs={12} md={6} key={t.id}>
              <Card sx={{ borderRadius: 3, p: 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip label={t.type} color={t.type === 'Mandatory' ? 'error' : 'primary'} size="small" />
                    <Chip label={t.status} variant="outlined" size="small" />
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t.title}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2">Trainer: <strong>{t.trainer}</strong></Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Event fontSize="small" color="action" />
                      <Typography variant="body2">Date: {t.date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2">Time: {t.time}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">Venue: {t.venue}</Typography>
                    </Box>
                  </Box>

                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    startIcon={<PlayArrow />}
                    onClick={() => alert(`Connecting to virtual room for: ${t.title}`)}
                  >
                    Join Live Training
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default TrainingPage;
