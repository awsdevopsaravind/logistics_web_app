import React, { useEffect, useState } from 'react';
import { 
  Typography, Paper, Grid, CircularProgress, Alert, Card, CardContent,
  Box, Chip, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress
} from '@mui/material';
import { 
  LocalShipping, Payment, AccountBalance, TrendingUp, Warning,
  AttachMoney, Assessment, Notifications
} from '@mui/icons-material';
import api from '../api/axios';

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [todayPayments, setTodayPayments] = useState([]);
  const [royaltyBalance, setRoyaltyBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all dashboard data
    Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/analytics/alerts'),
      api.get('/payments/today-pending'),
      api.get('/royalty/balance')
    ])
    .then(([kpiRes, alertRes, paymentRes, royaltyRes]) => {
      setKpis(kpiRes.data);
      setAlerts(alertRes.data);
      setTodayPayments(paymentRes.data);
      setRoyaltyBalance(royaltyRes.data);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to load dashboard data');
      setLoading(false);
    });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Business Dashboard - Rock Transport Operations
      </Typography>
      
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Notifications />
            <Typography variant="subtitle1">Urgent Alerts:</Typography>
            {alerts.map((alert, index) => (
              <Chip key={index} label={alert.message} color="warning" size="small" />
            ))}
          </Box>
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Today's Operations */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">Today's Trips</Typography>
                  <Typography variant="h4">{kpis?.todayTrips || 0}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {kpis?.todayTonnage || 0} tons total
                  </Typography>
                </Box>
                <LocalShipping color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">Today's Revenue</Typography>
                  <Typography variant="h4">₹{(kpis?.todayRevenue || 0).toLocaleString()}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    @ ₹{kpis?.avgRatePerTon || 645}/ton
                  </Typography>
                </Box>
                <AttachMoney color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Net Profit */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">Today's Profit</Typography>
                  <Typography variant="h4" color={kpis?.todayProfit >= 0 ? 'success.main' : 'error.main'}>
                    ₹{(kpis?.todayProfit || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {kpis?.profitMargin || 0}% margin
                  </Typography>
                </Box>
                <TrendingUp color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Royalty Balance */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">Royalty Balance</Typography>
                  <Typography variant="h4">{royaltyBalance?.remaining || 0}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    cubic meters left
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(royaltyBalance?.usagePercentage || 0)} 
                    color={royaltyBalance?.usagePercentage > 80 ? "warning" : "primary"}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <AccountBalance color="info" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Outstanding Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Money to Pay (Outstanding Payables)</Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Quarry Owners:</Typography>
                  <Typography color="error.main">₹{(kpis?.quarryOutstanding || 0).toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Vehicle Owners:</Typography>
                  <Typography color="error.main">₹{(kpis?.transporterOutstanding || 0).toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Government Royalty:</Typography>
                  <Typography color="error.main">₹{(kpis?.royaltyOutstanding || 0).toLocaleString()}</Typography>
                </Box>
                <hr />
                <Box display="flex" justifyContent="space-between" sx={{ fontWeight: 'bold' }}>
                  <Typography variant="subtitle1">Total Payables:</Typography>
                  <Typography variant="subtitle1" color="error.main">
                    ₹{((kpis?.quarryOutstanding || 0) + (kpis?.transporterOutstanding || 0) + (kpis?.royaltyOutstanding || 0)).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Money to Receive (Outstanding Receivables)</Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Pending Bills:</Typography>
                  <Typography color="success.main">₹{(kpis?.pendingReceivables || 0).toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Advances Given:</Typography>
                  <Typography color="warning.main">₹{(kpis?.advancesGiven || 0).toLocaleString()}</Typography>
                </Box>
                <hr />
                <Box display="flex" justifyContent="space-between" sx={{ fontWeight: 'bold' }}>
                  <Typography variant="subtitle1">Total Receivables:</Typography>
                  <Typography variant="subtitle1" color="success.main">
                    ₹{((kpis?.pendingReceivables || 0) + (kpis?.advancesGiven || 0)).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Working Capital: ₹{(kpis?.workingCapital || 0).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Pending Payments */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Today's Payment Schedule</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Party Type</TableCell>
                      <TableCell>Party Name</TableCell>
                      <TableCell>Vehicle/Quarry</TableCell>
                      <TableCell>Tonnage</TableCell>
                      <TableCell align="right">Amount (₹)</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todayPayments.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{payment.partyType}</TableCell>
                        <TableCell>{payment.partyName}</TableCell>
                        <TableCell>{payment.vehicleOrQuarry}</TableCell>
                        <TableCell>{payment.tonnage}</TableCell>
                        <TableCell align="right">₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.status} 
                            color={payment.status === 'Pending' ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
} 