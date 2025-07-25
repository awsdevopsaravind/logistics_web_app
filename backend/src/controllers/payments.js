exports.createQuarryPayment = (req, res) => {
  res.status(201).json({ message: 'Quarry payment recorded (mock)' });
};

exports.createTransporterPayment = (req, res) => {
  res.status(201).json({ message: 'Transporter payment recorded (mock)' });
};

exports.createCustomerPayment = (req, res) => {
  res.status(201).json({ message: 'Customer payment recorded (mock)' });
};

exports.getOutstandingPayments = (req, res) => {
  res.json({
    quarries: [{ id: 'q1', name: 'Quarry A', outstanding: 10000 }],
    transporters: [{ id: 't1', name: 'Transporter X', outstanding: 8000 }],
    customers: [{ id: 'c1', name: 'Customer Y', outstanding: 12000 }],
  });
};

exports.getPaymentHistory = (req, res) => {
  res.json([
    { id: 'p1', type: 'quarry', amount: 5000, date: '2024-07-01' },
    { id: 'p2', type: 'transporter', amount: 4000, date: '2024-07-02' },
  ]);
};

exports.updatePayment = (req, res) => {
  res.json({ message: `Payment ${req.params.id} updated (mock)` });
}; 