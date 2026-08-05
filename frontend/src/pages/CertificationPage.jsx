import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Avatar } from '@mui/material';
import { WorkspacePremium, Download, Verified, Share } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';

const certificates = [
  {
    id: 1,
    title: 'Certified Public Governance & Compliance Professional',
    issuedDate: '2026-06-15',
    certNumber: 'GEB-CERT-98214',
    issuer: 'Government Employee Board Authority',
    grade: 'Distinction'
  },
  {
    id: 2,
    title: 'Digital Office & Cyber Protocols Accreditation',
    issuedDate: '2026-04-10',
    certNumber: 'GEB-CERT-77341',
    issuer: 'National Informatics Center',
    grade: 'A+'
  }
];

const CertificationPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Certificates & Official Badges
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View earned accredited credentials, download PDF certificates, and verify credential numbers.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {certificates.map((cert) => (
            <Grid item xs={12} md={6} key={cert.id}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Box sx={{ p: 3, bgcolor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#8B5CF6', width: 50, height: 50 }}>
                    <WorkspacePremium />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                      {cert.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {cert.issuer}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Certificate ID</Typography>
                    <Typography variant="body2" fontWeight="bold" fontFamily="monospace">{cert.certNumber}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Issue Date</Typography>
                    <Typography variant="body2">{cert.issuedDate}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip icon={<Verified />} label="Verified & Active" color="success" size="small" />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      startIcon={<Download />}
                      onClick={() => alert(`Downloading Certificate: ${cert.certNumber}`)}
                    >
                      Download PDF
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<Share />}
                      onClick={() => alert(`Certificate Link Copied!`)}
                    >
                      Share
                    </Button>
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

export default CertificationPage;
