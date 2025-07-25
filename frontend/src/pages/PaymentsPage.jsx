import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function PaymentsPage() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Payments</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Payment records will appear here.</Typography>
      </Paper>
    </div>
  );
} 