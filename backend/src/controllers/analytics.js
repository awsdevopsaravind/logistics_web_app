exports.getDashboardKPIs = (req, res) => {
  res.json({
    todayTrips: 5,
    totalTonnage: 100,
    expectedRevenue: 64500,
    netProfit: 15000,
    profitMargin: 23.3,
  });
};

exports.getDailySummary = (req, res) => {
  res.json({
    date: '2024-07-01',
    totalTrips: 5,
    totalProfit: 15000,
    breakdown: [
      { quarry: 'Quarry A', profit: 8000 },
      { quarry: 'Quarry B', profit: 7000 },
    ],
  });
};

exports.getMonthlyReport = (req, res) => {
  res.json({
    month: 'July 2024',
    totalTrips: 120,
    totalProfit: 350000,
    trend: [10000, 12000, 15000, 18000],
  });
};

exports.getQuarryPerformance = (req, res) => {
  res.json([
    { quarry: 'Quarry A', totalProfit: 80000, trips: 40 },
    { quarry: 'Quarry B', totalProfit: 70000, trips: 35 },
  ]);
};

exports.getVehiclePerformance = (req, res) => {
  res.json([
    { vehicle: 'AP01AB1234', totalProfit: 40000, trips: 20 },
    { vehicle: 'AP01AB5678', totalProfit: 35000, trips: 18 },
  ]);
};

exports.getCashFlow = (req, res) => {
  res.json({
    inflow: 200000,
    outflow: 150000,
    status: 'positive',
  });
}; 