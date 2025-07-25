exports.purchaseRoyaltyStock = (req, res) => {
  res.status(201).json({ message: 'Royalty stock purchased (mock)' });
};

exports.getRoyaltyBalance = (req, res) => {
  res.json({
    remainingCubicMeters: 120.5,
    daysRemaining: 8,
    status: 'OK',
  });
};

exports.getRoyaltyAlerts = (req, res) => {
  res.json({
    alert: 'LOW_BALANCE',
    recommendation: 'Purchase more royalty stock soon.',
  });
};

exports.recordRoyaltyUsage = (req, res) => {
  res.status(201).json({ message: 'Royalty usage recorded (mock)' });
}; 