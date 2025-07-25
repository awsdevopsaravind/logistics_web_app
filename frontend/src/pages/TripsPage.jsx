import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function TripsPage() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Trips</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Trip list will appear here.</Typography>
      </Paper>
    </div>
  );
} 