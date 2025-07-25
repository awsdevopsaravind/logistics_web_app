const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments');

// Quarry payment
router.post('/quarry', paymentsController.createQuarryPayment);
// Transporter payment
router.post('/transporter', paymentsController.createTransporterPayment);
// Customer payment
router.post('/customer', paymentsController.createCustomerPayment);
// Get outstanding payments
router.get('/outstanding', paymentsController.getOutstandingPayments);
// Get payment history
router.get('/history', paymentsController.getPaymentHistory);
// Update payment
router.put('/:id', paymentsController.updatePayment);
// Get all payments (mock root endpoint)
router.get('/', (req, res) => {
  res.json([
    { id: 'p1', type: 'quarry', amount: 5000, date: '2024-07-01' },
    { id: 'p2', type: 'transporter', amount: 4000, date: '2024-07-02' },
  ]);
});

module.exports = router; 