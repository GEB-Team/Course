import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Paper, Fade, Button, Breadcrumbs, Link, Chip } from '@mui/material';
import { RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DocumentUpload from '../components/onboarding/DocumentUpload';
import DataReview from '../components/onboarding/DataReview';
import ResultDashboard from '../components/onboarding/ResultDashboard';

const steps = ['Upload Document', 'AI Validation & Review', 'Eligibility Result'];

const OnboardingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [extractionResult, setExtractionResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const navigate = useNavigate();

  const handleUploadSuccess = (data) => {
    setExtractionResult(data);
    setActiveStep(1);
  };

  const handleReviewSubmit = (resultData) => {
    setFinalResult(resultData);
    setActiveStep(2);
  };

  const handleReset = () => {
    setActiveStep(0);
    setExtractionResult(null);
    setFinalResult(null);
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', py: 2 }}>
        {/* Header Breadcrumbs & Action */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 0.5 }}>
              <Link 
                underline="hover" 
                color="inherit" 
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onClick={() => navigate('/employee/dashboard')}
              >
                Dashboard
              </Link>
              <Typography color="text.primary">Document Verification</Typography>
            </Breadcrumbs>
            <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShieldCheck color="#2563eb" size={32} />
              AI-Powered Document Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload official government credentials or certificates for automated verification and course eligibility.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/employee/dashboard')}
            >
              Back to Dashboard
            </Button>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<RefreshCw size={16} />}
                onClick={handleReset}
              >
                Upload New Document
              </Button>
            )}
          </Box>
        </Box>

        {/* Main Verification Stepper Paper */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2.5, md: 4 }, 
            borderRadius: 3, 
            border: '1px solid',
            borderColor: 'divider',
            background: 'background.paper',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': { color: 'primary.main' },
                        '&.Mui-completed': { color: 'success.main' },
                      }
                    }}
                  >
                    <Typography variant="body2" fontWeight={activeStep === index ? 700 : 500}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ minHeight: 380 }}>
            {activeStep === 0 && (
              <Fade in={activeStep === 0}>
                <Box>
                  <DocumentUpload onUploadSuccess={handleUploadSuccess} />
                </Box>
              </Fade>
            )}
            {activeStep === 1 && (
              <Fade in={activeStep === 1}>
                <Box>
                  <DataReview extractionResult={extractionResult} onSubmit={handleReviewSubmit} />
                </Box>
              </Fade>
            )}
            {activeStep === 2 && (
              <Fade in={activeStep === 2}>
                <Box>
                  <ResultDashboard result={finalResult} onVerifyAnother={handleReset} />
                </Box>
              </Fade>
            )}
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default OnboardingPage;
