import React, { useEffect, useState } from 'react';
import { Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import api from '../api/axios';

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(res => {
        setKpis(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load dashboard KPIs');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Today's Trips</Typography>
            <Typography variant="h3">{kpis.todayTrips}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Tonnage</Typography>
            <Typography variant="h3">{kpis.totalTonnage}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Net Profit</Typography>
            <Typography variant="h3">₹{kpis.netProfit}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
} 