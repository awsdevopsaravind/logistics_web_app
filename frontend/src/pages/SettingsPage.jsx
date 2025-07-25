import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function SettingsPage() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>App settings and preferences will appear here.</Typography>
      </Paper>
    </div>
  );
} 