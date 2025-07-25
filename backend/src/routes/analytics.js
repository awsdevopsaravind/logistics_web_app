const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics');

router.get('/dashboard', analyticsController.getDashboardKPIs);
router.get('/daily-summary', analyticsController.getDailySummary);
router.get('/monthly-report', analyticsController.getMonthlyReport);
router.get('/quarry-performance', analyticsController.getQuarryPerformance);
router.get('/vehicle-performance', analyticsController.getVehiclePerformance);
router.get('/cash-flow', analyticsController.getCashFlow);

// Get analytics dashboard (mock root endpoint)
router.get('/', (req, res) => {
  res.json({
    dashboard: 'mock',
    todayTrips: 5,
    totalTonnage: 100,
    netProfit: 15000
  });
});

module.exports = router; 