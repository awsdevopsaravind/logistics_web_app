const express = require('express');
const router = express.Router();
const royaltyController = require('../controllers/royalty');

// Record new royalty stock purchase
router.post('/purchase', royaltyController.purchaseRoyaltyStock);
// Get current royalty balance
router.get('/balance', royaltyController.getRoyaltyBalance);
// Get royalty alerts
router.get('/alerts', royaltyController.getRoyaltyAlerts);
// Record royalty usage
router.post('/usage', royaltyController.recordRoyaltyUsage);

// Get royalty summary (mock root endpoint)
router.get('/', (req, res) => {
  res.json({
    remainingCubicMeters: 120.5,
    status: 'OK',
    daysRemaining: 8
  });
});

module.exports = router; 