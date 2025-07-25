import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function RoyaltyPage() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Royalty Management</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Royalty stock and usage info will appear here.</Typography>
      </Paper>
    </div>
  );
} 