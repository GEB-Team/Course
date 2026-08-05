import React, { useRef, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Divider, IconButton, Alert, Chip 
} from '@mui/material';
import { X, Download, Copy, Check, QrCode, ShieldCheck, ExternalLink } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeModal = ({ open, onClose, record }) => {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  const verificationUrl = `https://geb.gov.in/verify/service-record/${record.employee_id}`;
  const qrValue = record.qr_payload || verificationUrl;

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `GEB_QR_${record.employee_id}.png`;
      link.href = url;
      link.click();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1, textAlign: 'center' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QrCode size={22} color="#2563EB" />
          <Typography variant="h6" fontWeight={700}>
            Official Service Record QR
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          Scan to verify credentials on the National Public Service Portal
        </Typography>

        <Box 
          ref={qrRef}
          sx={{ 
            p: 2.5, 
            bgcolor: '#FFFFFF', 
            borderRadius: 3, 
            display: 'inline-block',
            border: '2px solid #E2E8F0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
          }}
        >
          <QRCodeCanvas 
            value={qrValue} 
            size={200} 
            level="H" 
            includeMargin={true}
          />
        </Box>

        <Box sx={{ mt: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {record.full_name}
          </Typography>
          <Typography variant="body2" color="primary" fontWeight={600}>
            {record.employee_id} • {record.registration_number}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            {record.designation} ({record.department})
          </Typography>

          <Chip 
            icon={<ShieldCheck size={14} />}
            label="Cryptographically Signed" 
            color="success" 
            size="small" 
            sx={{ mt: 1.5, fontWeight: 600, fontSize: '0.72rem' }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
        <Button 
          variant="outlined" 
          startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
          onClick={handleCopy}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {copied ? 'Copied' : 'Copy Link'}
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Download size={16} />}
          onClick={handleDownload}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Download QR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeModal;
