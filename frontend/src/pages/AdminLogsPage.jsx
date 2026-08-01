import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { HistoryEdu } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';

const mockLogs = [
  { id: 1, action: 'Document approved by Admin (Admin User)', time: '10 mins ago', user: 'admin@geb.gov', status: 'Success' },
  { id: 2, action: 'User login manual authenticated', time: '25 mins ago', user: 'admin@geb.gov', status: 'Success' },
  { id: 3, action: 'AI OCR validation completed with confidence 98%', time: '1 hour ago', user: 'system@geb.gov', status: 'Success' },
  { id: 4, action: 'New employee registered (CITIZEN application)', time: '2 hours ago', user: 'user@geb.gov', status: 'Success' },
  { id: 5, action: 'Document verification initiated for file ID 104', time: '3 hours ago', user: 'user@geb.gov', status: 'Success' },
];

const AdminLogsPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HistoryEdu color="primary" />
            Audit & System Activity Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Immutable tracking log of administrative actions, user logins, and AI verification events.
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Actor / Initiator</TableCell>
                  <TableCell>Activity Description</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{log.time}</TableCell>
                    <TableCell fontWeight={600}>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell align="right">
                      <Chip label={log.status} color="success" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default AdminLogsPage;
