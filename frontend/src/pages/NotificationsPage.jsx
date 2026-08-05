import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Chip, Button, Divider } from '@mui/material';
import { Notifications, CheckCircle, Warning, Info, Assignment } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';

const notifications = [
  {
    id: 1,
    title: 'Document Verification Complete',
    desc: 'Your uploaded credentials have been reviewed and verified with 98% AI confidence.',
    time: '2 hours ago',
    type: 'success',
    unread: true
  },
  {
    id: 2,
    title: 'Mandatory Compliance Module Due',
    desc: 'Please complete the Cyber Compliance & Records Management module before Aug 30.',
    time: '1 day ago',
    type: 'warning',
    unread: false
  },
  {
    id: 3,
    title: 'New AI Recommended Courses',
    desc: '3 new personalized courses have been recommended based on your role experience.',
    time: '3 days ago',
    type: 'info',
    unread: false
  }
];

const NotificationsPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto', pb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Notifications & Alerts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay updated on document verifications, training deadlines, and board announcements.
            </Typography>
          </Box>
          <Button variant="outlined" size="small">Mark All as Read</Button>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {notifications.map((n, idx) => (
              <React.Fragment key={n.id}>
                <ListItem 
                  sx={{ 
                    p: 2.5, 
                    bgcolor: n.unread ? 'action.hover' : 'background.paper',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    {n.type === 'success' && <CheckCircle color="success" />}
                    {n.type === 'warning' && <Warning color="warning" />}
                    {n.type === 'info' && <Info color="primary" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={n.unread ? 700 : 500}>
                          {n.title}
                        </Typography>
                        {n.unread && <Chip label="New" color="primary" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">{n.desc}</Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>{n.time}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {idx < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default NotificationsPage;
