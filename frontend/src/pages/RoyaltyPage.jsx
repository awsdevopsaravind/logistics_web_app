import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Grid, Card, CardContent, Box, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Chip, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  AccountBalance, Warning, CheckCircle, Add, Receipt,
  Timeline, TrendingDown, Inventory
} from '@mui/icons-material';
import api from '../api/axios';

export default function RoyaltyPage() {
  const [royaltyData, setRoyaltyData] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    cubicMeters: '',
    ratePerCubicMeter: '',
    receiptNo: '',
    expiryDate: ''
  });

  useEffect(() => {
    loadRoyaltyData();
  }, []);

  const loadRoyaltyData = async () => {
    try {
      const [balanceRes, stocksRes, usageRes, alertsRes] = await Promise.all([
        api.get('/analytics/royalty/balance'),
        api.get('/royalty/stocks'),
        api.get('/royalty/usage-history'),
        api.get('/analytics/alerts')
      ]);

      setRoyaltyData(balanceRes.data);
      setStocks(stocksRes.data);
      setUsageHistory(usageRes.data);
      setAlerts(alertsRes.data.filter(alert => alert.type.includes('ROYALTY')));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load royalty data:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      await api.post('/royalty/purchase', {
        purchasedCubicMeters: parseFloat(newPurchase.cubicMeters),
        ratePerCubicMeter: parseFloat(newPurchase.ratePerCubicMeter),
        governmentReceiptNo: newPurchase.receiptNo,
        expiryDate: newPurchase.expiryDate
      });
      
      setOpenPurchaseDialog(false);
      setNewPurchase({ cubicMeters: '', ratePerCubicMeter: '', receiptNo: '', expiryDate: '' });
      loadRoyaltyData();
    } catch (error) {
      console.error('Failed to record purchase:', error);
    }
  };

  if (loading) return <Typography>Loading royalty data...</Typography>;

  const getStatusColor = (remaining) => {
    if (remaining < 100) return 'error';
    if (remaining < 200) return 'warning';
    return 'success';
  };

  const getUsageColor = (percentage) => {
    if (percentage > 80) return 'warning';
    if (percentage > 95) return 'error';
    return 'primary';
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Government Royalty Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenPurchaseDialog(true)}
        >
          Record New Purchase
        </Button>
      </Box>

      {/* Alerts */}
      {alerts.map((alert, index) => (
        <Alert 
          key={index} 
          severity={alert.severity} 
          sx={{ mb: 2 }}
          icon={<Warning />}
        >
          {alert.message}
        </Alert>
      ))}

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">Total Balance</Typography>
                  <Typography variant="h4">{royaltyData?.remaining || 0}</Typography>
                  <Typography variant="body2" color="textSecondary">cubic meters</Typography>
                </Box>
                <Inventory color={getStatusColor(royaltyData?.remaining)} fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">Usage This Month</Typography>
                  <Typography variant="h4">{royaltyData?.monthlyUsage || 0}</Typography>
                  <Typography variant="body2" color="textSecondary">cubic meters</Typography>
                </Box>
                <TrendingDown color="info" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">Days Remaining</Typography>
                  <Typography variant="h4">{royaltyData?.estimatedDays || 0}</Typography>
                  <Typography variant="body2" color="textSecondary">at current usage</Typography>
                </Box>
                <Timeline color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">Total Value</Typography>
                  <Typography variant="h4">₹{(royaltyData?.totalValue || 0).toLocaleString()}</Typography>
                  <Typography variant="body2" color="textSecondary">remaining stock</Typography>
                </Box>
                <AccountBalance color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Usage Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Current Usage Status</Typography>
          <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Used: {royaltyData?.used || 0} cubic meters</Typography>
              <Typography variant="body2">
                {royaltyData?.usagePercentage || 0}% consumed
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={royaltyData?.usagePercentage || 0}
              color={getUsageColor(royaltyData?.usagePercentage)}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Remaining: {royaltyData?.remaining || 0} cubic meters
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Active Stock Details */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active Royalty Stock</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Purchase Date</TableCell>
                      <TableCell>Receipt No</TableCell>
                      <TableCell align="right">Purchased (m³)</TableCell>
                      <TableCell align="right">Used (m³)</TableCell>
                      <TableCell align="right">Remaining (m³)</TableCell>
                      <TableCell align="right">Rate (₹/m³)</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell>{new Date(stock.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell>{stock.governmentReceiptNo}</TableCell>
                        <TableCell align="right">{stock.purchasedCubicMeters}</TableCell>
                        <TableCell align="right">{stock.usedCubicMeters}</TableCell>
                        <TableCell align="right">{stock.remainingCubicMeters}</TableCell>
                        <TableCell align="right">₹{stock.ratePerCubicMeter}</TableCell>
                        <TableCell>
                          {stock.expiryDate ? new Date(stock.expiryDate).toLocaleDateString() : 'No Expiry'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={stock.status}
                            color={stock.status === 'ACTIVE' ? 'success' : 'default'}
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

      {/* Recent Usage History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Usage History</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Vehicle No</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell align="right">Tonnage</TableCell>
                  <TableCell align="right">Cubic Meters Used</TableCell>
                  <TableCell align="right">Rate Applied</TableCell>
                  <TableCell align="right">Cost (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usageHistory.slice(0, 10).map((usage, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(usage.date).toLocaleDateString()}</TableCell>
                    <TableCell>{usage.vehicleNo}</TableCell>
                    <TableCell>{usage.destination}</TableCell>
                    <TableCell align="right">{usage.tonnage}</TableCell>
                    <TableCell align="right">{usage.cubicMetersUsed}</TableCell>
                    <TableCell align="right">₹{usage.ratePerCubicMeter}</TableCell>
                    <TableCell align="right">₹{(usage.cubicMetersUsed * usage.ratePerCubicMeter).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Purchase Dialog */}
      <Dialog open={openPurchaseDialog} onClose={() => setOpenPurchaseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record New Royalty Purchase</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cubic Meters Purchased"
                  type="number"
                  value={newPurchase.cubicMeters}
                  onChange={(e) => setNewPurchase({ ...newPurchase, cubicMeters: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rate per Cubic Meter (₹)"
                  type="number"
                  value={newPurchase.ratePerCubicMeter}
                  onChange={(e) => setNewPurchase({ ...newPurchase, ratePerCubicMeter: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Government Receipt Number"
                  value={newPurchase.receiptNo}
                  onChange={(e) => setNewPurchase({ ...newPurchase, receiptNo: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Expiry Date (if any)"
                  type="date"
                  value={newPurchase.expiryDate}
                  onChange={(e) => setNewPurchase({ ...newPurchase, expiryDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPurchaseDialog(false)}>Cancel</Button>
          <Button onClick={handlePurchase} variant="contained">Record Purchase</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 