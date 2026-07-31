import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { MenuBook, Add } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';

const adminCourses = [
  { id: 1, title: 'Government Office Procedures & E-Governance', category: 'Administration', enrolled: 142, status: 'Active' },
  { id: 2, title: 'Digital File Management & Cyber Compliance', category: 'IT & Security', enrolled: 98, status: 'Active' },
  { id: 3, title: 'Public Service Ethics & Regulatory Frameworks', category: 'Compliance', enrolled: 85, status: 'Active' },
  { id: 4, title: 'Executive Leadership & Project Management', category: 'Leadership', enrolled: 64, status: 'Active' },
  { id: 5, title: 'AI & Data-Driven Governance', category: 'Technology', enrolled: 110, status: 'Active' },
];

const AdminCoursesPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <MenuBook color="primary" />
              Course Catalog Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add new training modules, update curricula, and monitor enrollment statistics.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={() => alert('New Course Creator Modal')}>
            Add New Course
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell>Course Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Enrolled Employees</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminCourses.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell fontWeight={600}>{c.title}</TableCell>
                    <TableCell>
                      <Chip label={c.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{c.enrolled} Enrolled</TableCell>
                    <TableCell>
                      <Chip label={c.status} color="success" size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => alert(`Edit ${c.title}`)}>
                        Edit Curriculum
                      </Button>
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

export default AdminCoursesPage;
