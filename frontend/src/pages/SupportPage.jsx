import React from 'react';
import { Box, Typography, Paper, Grid, Accordion, AccordionSummary, AccordionDetails, Button, TextField } from '@mui/material';
import { ExpandMore, Help, Email, Phone, Chat } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';

const faqs = [
  {
    q: 'How does the AI document verification work?',
    a: 'Our portal utilizes advanced OCR (Optical Character Recognition) to extract full name, dates, certificate types, and experience from your uploaded PDF or image, and automatically verifies it against government database records.'
  },
  {
    q: 'What file formats are accepted for document upload?',
    a: 'We accept PDF, JPEG, and PNG files up to 5MB in size. Ensure scans are clear and not cut off.'
  },
  {
    q: 'What happens if my document is rejected?',
    a: 'You will receive an instant notification with the specific reason (e.g. illegible scan, missing seal). You can re-upload your document at any time from the Document Verification page.'
  },
  {
    q: 'How do I download my course completion certificates?',
    a: 'Once you finish 100% of a course module, navigate to the Certification tab to view and download your verifiable PDF badge.'
  }
];

const SupportPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 960, mx: 'auto', pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Help & Support Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Find quick answers to common questions or reach out to our technical support team.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Frequently Asked Questions
            </Typography>
            {faqs.map((faq, i) => (
              <Accordion key={i} sx={{ mb: 1.5, borderRadius: '8px !important', border: '1px solid', borderColor: 'divider' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2" fontWeight={600}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact Support Desk
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Submit an inquiry and our support engineers will respond within 24 hours.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Subject / Issue Category" fullWidth size="small" />
                <TextField label="Detailed Message" multiline rows={4} fullWidth size="small" />
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => alert('Support ticket submitted successfully! Reference: TKT-' + Math.floor(1000 + Math.random()*9000))}
                >
                  Submit Ticket
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default SupportPage;
