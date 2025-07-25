const tripUtils = require('../utils/tripUtils');

exports.createTrip = (req, res) => {
  // Use tripUtils.calculateTripProfit for mock calculation
  const { tonnage, quarryRate, transportRate, sellingRate, royaltyCost } = req.body;
  const profit = tripUtils.calculateTripProfit(tonnage, quarryRate, transportRate, sellingRate, royaltyCost);
  res.status(201).json({ message: 'Trip created (mock)', profit });
};

exports.getTrips = (req, res) => {
  // Return mock trip list
  res.json([
    { id: '1', date: '2024-07-01', vehicleNo: 'AP01AB1234', tonnage: 20, profit: 5000 },
    { id: '2', date: '2024-07-02', vehicleNo: 'AP01AB5678', tonnage: 18, profit: 4500 },
  ]);
};

exports.updateTrip = (req, res) => {
  res.json({ message: `Trip ${req.params.id} updated (mock)` });
};

exports.deleteTrip = (req, res) => {
  res.json({ message: `Trip ${req.params.id} deleted (mock)` });
};

exports.getTripSummary = (req, res) => {
  // Return mock summary
  res.json({
    totalTrips: 2,
    totalTonnage: 38,
    totalProfit: 9500,
  });
}; 