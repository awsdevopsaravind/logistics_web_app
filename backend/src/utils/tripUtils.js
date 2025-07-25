// Convert cubic meters to tonnage based on rock type
function convertCubicMetersToTonnage(cubicMeters, rockType = 'default') {
  // Example conversion factors (customize as needed)
  const factors = {
    granite: 2.7,
    limestone: 2.5,
    default: 2.6,
  };
  const factor = factors[rockType] || factors.default;
  return cubicMeters * factor;
}

// Calculate trip profit
function calculateTripProfit(tonnage, quarryRate, transportRate, sellingRate, royaltyCost) {
  const totalCost = (quarryRate + transportRate + royaltyCost) * tonnage;
  const totalRevenue = sellingRate * tonnage;
  return totalRevenue - totalCost;
}

module.exports = {
  convertCubicMetersToTonnage,
  calculateTripProfit,
}; 