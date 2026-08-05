import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Card, CardContent, Button, 
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from '@mui/material';
import { Payment, CheckCircle, Receipt, CreditCard } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';

const paymentHistory = [
  { id: 'PAY-1092', desc: 'Government Onboarding Verification Fee', amount: '$45.00', date: '2026-07-28', status: 'Completed' },
  { id: 'PAY-1088', desc: 'Advanced Leadership Course Registration', amount: '$120.00', date: '2026-06-12', status: 'Completed' },
];

const PaymentPage = () => {
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  const handlePayNow = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPayModalOpen(false);
      alert('Payment processed successfully! Receipt generated.');
    }, 1200);
  };

  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Payments & Invoices
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage course fees, document verification charges, and download official payment receipts.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <Typography variant="caption" color="text.secondary">Outstanding Dues</Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">$0.00</Typography>
              <Chip label="All Clear" color="success" size="small" sx={{ mt: 1 }} />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <Typography variant="caption" color="text.secondary">Total Paid This Year</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">$165.00</Typography>
              <Chip label="2 Transactions" size="small" sx={{ mt: 1 }} />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<CreditCard />}
                onClick={() => setPayModalOpen(true)}
              >
                Make Quick Payment
              </Button>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Transaction History & Receipts
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Receipt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell fontWeight="bold">{item.id}</TableCell>
                    <TableCell>{item.desc}</TableCell>
                    <TableCell fontWeight="bold">{item.amount}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Chip label={item.status} color="success" size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<Receipt />} onClick={() => alert(`Receipt for ${item.id}`)}>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={payModalOpen} onClose={() => setPayModalOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Card Number" fullWidth defaultValue="4242 •••• •••• 4242" />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Expiry" fullWidth defaultValue="12/28" />
                <TextField label="CVC" fullWidth defaultValue="123" />
              </Box>
              <TextField label="Amount ($)" fullWidth defaultValue="50.00" />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPayModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handlePayNow} disabled={paying}>
              {paying ? 'Processing...' : 'Pay $50.00'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default PaymentPage;
