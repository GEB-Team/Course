import React from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Chip, Grid } from '@mui/material';
import { CheckCircle, XCircle, AlertCircle, BookOpen, User, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResultDashboard = ({ result }) => {
  const navigate = useNavigate();

  if (!result) return null;

  const isEligible = result.status === 'Eligible';
  const isManualReview = result.status === 'Manual Review Required';

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        {isEligible ? (
          <CheckCircle size={80} color="#4caf50" />
        ) : isManualReview ? (
          <AlertCircle size={80} color="#ff9800" />
        ) : (
          <XCircle size={80} color="#f44336" />
        )}
      </Box>

      <Typography variant="h4" fontWeight={700} gutterBottom color={isEligible ? 'success.main' : isManualReview ? 'warning.main' : 'error.main'}>
        {isEligible ? 'Registration Successful' : result.status}
      </Typography>

      {!isEligible && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          {result.reason || 'Your application requires further manual review by an administrator.'}
        </Typography>
      )}

      {isEligible && (
        <Paper elevation={0} sx={{ backgroundColor: 'rgba(76, 175, 80, 0.05)', border: '1px solid', borderColor: 'success.light', p: 3, borderRadius: 3, mt: 4, mb: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Generated Employee ID</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <Hash size={20} color="#4caf50" style={{ marginRight: 8 }} />
                <Typography variant="h5" fontWeight={700} letterSpacing={1}>{result.employee_id}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {isEligible && result.recommended_courses?.length > 0 && (
        <Box sx={{ textAlign: 'left', mt: 4, mb: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BookOpen size={24} style={{ marginRight: 8 }} color="#1976d2" />
            Recommended AI Training Courses
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {result.recommended_courses.map((course, index) => (
              <ListItem key={index} sx={{ backgroundColor: 'background.paper', mb: 1, borderRadius: 2, border: '1px solid #eee' }}>
                <ListItemIcon>
                  <CheckCircle size={20} color="#1976d2" />
                </ListItemIcon>
                <ListItemText primary={course} primaryTypographyProps={{ fontWeight: 500 }} />
                <Button size="small" variant="outlined" sx={{ borderRadius: 4, textTransform: 'none' }}>Enroll</Button>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ mt: 5 }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={() => navigate('/employee/dashboard')}
          sx={{ borderRadius: 2, px: 6, textTransform: 'none' }}
        >
          Go to Employee Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default ResultDashboard;
