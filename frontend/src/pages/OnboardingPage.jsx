import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Paper, Fade } from '@mui/material';
import DocumentUpload from '../components/onboarding/DocumentUpload';
import DataReview from '../components/onboarding/DataReview';
import ResultDashboard from '../components/onboarding/ResultDashboard';

const steps = ['Upload Document', 'AI Validation & Review', 'Eligibility Result'];

const OnboardingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [extractionResult, setExtractionResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const handleUploadSuccess = (data) => {
    setExtractionResult(data);
    setActiveStep(1);
  };

  const handleReviewSubmit = (resultData) => {
    setFinalResult(resultData);
    setActiveStep(2);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, backgroundColor: 'background.default' }}>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        AI-Powered Document Verification
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        ZYNTRA Employee Onboarding Portal
      </Typography>

      <Paper elevation={4} sx={{ width: '80%', maxWidth: 900, p: 4, borderRadius: 3, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, minHeight: 400 }}>
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
                <ResultDashboard result={finalResult} />
              </Box>
            </Fade>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default OnboardingPage;
