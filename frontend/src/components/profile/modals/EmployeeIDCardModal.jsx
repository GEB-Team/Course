import React, { useRef } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Divider, IconButton, Grid, Avatar 
} from '@mui/material';
import { X, Printer, Download, Shield, ShieldCheck, Hash, Building2, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const EmployeeIDCardModal = ({ open, onClose, record }) => {
  const cardRef = useRef(null);

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldCheck size={22} color="#2563EB" />
          <Typography variant="h6" fontWeight={700}>
            Official Government Smart ID Card
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        {/* Printable Smart ID Card */}
        <Box
          id="printable-id-card"
          ref={cardRef}
          sx={{
            width: 420,
            maxWidth: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.25)',
            border: '2px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#0F172A',
            fontFamily: 'Inter, sans-serif',
            position: 'relative'
          }}
        >
          {/* Holographic Top Banner */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)',
              color: '#FFFFFF',
              p: 2,
              textAlign: 'center',
              position: 'relative',
              borderBottom: '3px solid #F59E0B'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Shield size={20} color="#FBBF24" />
              <Typography variant="subtitle2" fontWeight={800} letterSpacing={1.2} textTransform="uppercase">
                Government Engineering Board
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#93C5FD', fontSize: '0.7rem', display: 'block', fontWeight: 600 }}>
              Ministry of Housing & Urban Infrastructure • Gov of India
            </Typography>
          </Box>

          {/* Security Strip */}
          <Box sx={{ height: 4, background: 'linear-gradient(90deg, #F59E0B, #10B981, #38BDF8, #8B5CF6)' }} />

          {/* Body */}
          <Box sx={{ p: 2.5 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Photo & QR */}
              <Grid item xs={4.5} sx={{ textAlign: 'center' }}>
                <Avatar
                  src={record.profile_picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                  alt={record.full_name}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2.5,
                    border: '3px solid #2563EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    mx: 'auto',
                    mb: 1.5
                  }}
                />
                <Box sx={{ p: 0.5, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0', display: 'inline-block' }}>
                  <QRCodeSVG 
                    value={record.qr_payload || record.employee_id} 
                    size={68} 
                    level="M"
                  />
                </Box>
              </Grid>

              {/* Information */}
              <Grid item xs={7.5}>
                <Typography variant="h6" fontWeight={800} color="#0F172A" sx={{ fontSize: '1.05rem', lineHeight: 1.2 }}>
                  {record.full_name}
                </Typography>
                <Typography variant="caption" color="primary" fontWeight={700} display="block" sx={{ mt: 0.3, mb: 1 }}>
                  {record.designation}
                </Typography>

                <Box sx={{ fontSize: '0.78rem', color: '#475569' }}>
                  <Box sx={{ mb: 0.4 }}>
                    <strong style={{ color: '#0F172A' }}>Emp ID:</strong> {record.employee_id}
                  </Box>
                  <Box sx={{ mb: 0.4 }}>
                    <strong style={{ color: '#0F172A' }}>Reg No:</strong> {record.registration_number}
                  </Box>
                  <Box sx={{ mb: 0.4 }}>
                    <strong style={{ color: '#0F172A' }}>Cadre:</strong> {record.employee_category}
                  </Box>
                  <Box sx={{ mb: 0.4 }}>
                    <strong style={{ color: '#0F172A' }}>Department:</strong> {record.department}
                  </Box>
                  <Box sx={{ mb: 0.4 }}>
                    <strong style={{ color: '#0F172A' }}>Blood Group:</strong> {record.personal_info?.blood_group || 'O+'}
                  </Box>
                  <Box sx={{ mb: 0.4 }}>
                    <strong style={{ color: '#0F172A' }}>Emergency:</strong> {record.personal_info?.emergency_contact_phone || '+91 98111 22334'}
                  </Box>
                  <Box>
                    <strong style={{ color: '#0F172A' }}>Valid Thru:</strong> {record.registration_details?.registration_expiry || '09-Apr-2028'}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Barcode & Footer Strip */}
          <Box
            sx={{
              bgcolor: '#F1F5F9',
              p: 1.5,
              borderTop: '1px solid #E2E8F0',
              textAlign: 'center'
            }}
          >
            {/* Simulated Barcode */}
            <Box
              sx={{
                letterSpacing: 5,
                fontWeight: 900,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#1E293B'
              }}
            >
              ||||| ||| ||||||| || |||||| ||| ||||| ||||||
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.65rem', display: 'block', mt: 0.3 }}>
              GEB • OFFICIALLY ISSUED • PROPERTY OF GOVERNMENT OF INDIA
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>
          Close
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Printer size={16} />}
            onClick={handlePrint}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Print / Save PDF ID Card
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeIDCardModal;
