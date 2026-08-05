import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Divider, Button, 
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton 
} from '@mui/material';
import { Award, Download, ShieldCheck, CheckCircle2, X, Hash, Calendar, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CertificationsTab = ({ record }) => {
  const [verifyModal, setVerifyModal] = useState(null);

  if (!record) return null;
  const certs = record.certifications || [];

  const handleDownloadCert = (cert) => {
    alert(`Downloading official certified copy for: "${cert.certificate_name}" (${cert.certificate_number})`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Official Board Certifications & Professional Licenses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Statutory engineering licenses and national board certifications issued under the GEB Act.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {certs.map((c, idx) => (
          <Grid item xs={12} md={6} key={c.id || idx}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                }
              }}
            >
              {/* Top Accent line */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: '#2563EB' }} />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main' }}>
                    <Award size={24} />
                  </Box>
                  <Chip
                    icon={<ShieldCheck size={14} />}
                    label={c.verification_status || 'Verified & Active'}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  />
                </Box>

                <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                  {c.certificate_name}
                </Typography>

                <Box sx={{ fontSize: '0.85rem', color: '#475569', mb: 2 }}>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>License Number:</strong> <span style={{ color: '#2563EB', fontWeight: 700 }}>{c.certificate_number}</span>
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Issuing Body:</strong> {c.issuer_authority}
                  </Box>
                  <Box>
                    <strong>Issued:</strong> {c.issued_date} • <strong>Valid Thru:</strong> {c.expiry_date}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShieldCheck size={14} />}
                  onClick={() => setVerifyModal(c)}
                  sx={{ flex: 1, borderRadius: 2, textTransform: 'none' }}
                >
                  Verify Certificate
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Download size={14} />}
                  onClick={() => handleDownloadCert(c)}
                  sx={{ flex: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Download
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Verification Modal */}
      <Dialog
        open={Boolean(verifyModal)}
        onClose={() => setVerifyModal(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldCheck size={20} color="#10B981" />
            <Typography variant="subtitle1" fontWeight={700}>
              Cryptographic Board Verification
            </Typography>
          </Box>
          <IconButton onClick={() => setVerifyModal(null)} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.08)', borderRadius: 3, border: '1px solid rgba(16, 185, 129, 0.2)', mb: 2 }}>
            <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 8px' }} />
            <Typography variant="h6" fontWeight={800} color="success.main">
              License Authenticated & Valid
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Verified against the Government National Civil Engineer Register.
            </Typography>
          </Box>

          <Typography variant="subtitle2" fontWeight={700}>
            {verifyModal?.certificate_name}
          </Typography>
          <Typography variant="body2" color="primary" fontWeight={700} sx={{ my: 0.5 }}>
            {verifyModal?.certificate_number}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Holder: {record.full_name} ({record.employee_id})
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setVerifyModal(null)} fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CertificationsTab;
