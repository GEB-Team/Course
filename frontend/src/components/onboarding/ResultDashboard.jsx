import React from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Grid } from '@mui/material';
import { CheckCircle, XCircle, AlertCircle, BookOpen, Hash, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResultDashboard = ({ result, onVerifyAnother }) => {
  const navigate = useNavigate();

  if (!result) return null;

  const isEligible = result.status === 'Eligible';
  const isManualReview = result.status === 'Manual Review Required';

  return (
    <Box sx={{ p: 2, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        {isEligible ? (
          <CheckCircle size={72} color="#10B981" />
        ) : isManualReview ? (
          <AlertCircle size={72} color="#F59E0B" />
        ) : (
          <XCircle size={72} color="#EF4444" />
        )}
      </Box>

      <Typography 
        variant="h4" 
        fontWeight={700} 
        gutterBottom 
        color={isEligible ? 'success.main' : isManualReview ? 'warning.main' : 'error.main'}
      >
        {isEligible ? 'Registration & Eligibility Verified' : result.status}
      </Typography>

      {!isEligible && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3, maxWidth: 500, mx: 'auto' }}>
          {result.reason || 'Your application requires administrative review or adjustment in submitted details.'}
        </Typography>
      )}

      {isEligible && (
        <Paper 
          elevation={0} 
          sx={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.08)', 
            border: '1px solid', 
            borderColor: 'success.light', 
            p: 2.5, 
            borderRadius: 3, 
            my: 3 
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
            Assigned Government Employee ID
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
            <Hash size={22} color="#10B981" style={{ marginRight: 6 }} />
            <Typography variant="h5" fontWeight={800} letterSpacing={1.5} color="primary.main">
              {result.employee_id}
            </Typography>
          </Box>
        </Paper>
      )}

      {isEligible && result.recommended_courses?.length > 0 && (
        <Box sx={{ textAlign: 'left', mt: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookOpen size={20} color="#2563EB" />
            AI Recommended Learning Modules
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List sx={{ p: 0 }}>
            {result.recommended_courses.map((course, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  backgroundColor: 'background.paper', 
                  mb: 1.5, 
                  borderRadius: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 1.5
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle size={18} color="#10B981" />
                </ListItemIcon>
                <ListItemText primary={course} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => navigate('/courses/register')}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Enroll
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={() => navigate('/employee/dashboard')}
          endIcon={<ArrowRight size={18} />}
          sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600 }}
        >
          Go to Employee Dashboard
        </Button>
        {onVerifyAnother && (
          <Button 
            variant="outlined" 
            size="large"
            onClick={onVerifyAnother}
            startIcon={<RefreshCw size={18} />}
            sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
          >
            Verify Another Document
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ResultDashboard;
