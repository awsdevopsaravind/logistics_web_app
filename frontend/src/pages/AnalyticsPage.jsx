import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function AnalyticsPage() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Analytics</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Analytics charts and KPIs will appear here.</Typography>
      </Paper>
    </div>
  );
} 