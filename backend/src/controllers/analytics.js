const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardKPIs = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's trip data
    const todayTrips = await prisma.trip.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        quarry: true,
        transporter: true
      }
    });

    // Calculate today's metrics
    const todayTonnage = todayTrips.reduce((sum, trip) => sum + trip.tonnage, 0);
    const todayRevenue = todayTrips.reduce((sum, trip) => sum + trip.sellingPrice, 0);
    const todayCosts = todayTrips.reduce((sum, trip) => 
      sum + trip.materialCost + trip.transportCost + (trip.tonnage * 2.5 * 245), 0); // Royalty cost estimation
    const todayProfit = todayRevenue - todayCosts;
    const profitMargin = todayRevenue > 0 ? ((todayProfit / todayRevenue) * 100).toFixed(1) : 0;

    // Outstanding calculations
    const quarryOutstanding = await calculateQuarryOutstanding();
    const transporterOutstanding = await calculateTransporterOutstanding();
    const royaltyOutstanding = await calculateRoyaltyOutstanding();
    
    // Receivables calculations
    const pendingReceivables = await calculatePendingReceivables();
    const advancesGiven = await calculateAdvancesGiven();
    
    const workingCapital = pendingReceivables + advancesGiven - 
                          (quarryOutstanding + transporterOutstanding + royaltyOutstanding);

    res.json({
      todayTrips: todayTrips.length,
      todayTonnage: parseFloat(todayTonnage.toFixed(2)),
      todayRevenue: parseFloat(todayRevenue.toFixed(2)),
      todayProfit: parseFloat(todayProfit.toFixed(2)),
      profitMargin: parseFloat(profitMargin),
      avgRatePerTon: todayTonnage > 0 ? parseFloat((todayRevenue / todayTonnage).toFixed(2)) : 645,
      
      // Outstanding amounts
      quarryOutstanding: parseFloat(quarryOutstanding.toFixed(2)),
      transporterOutstanding: parseFloat(transporterOutstanding.toFixed(2)),
      royaltyOutstanding: parseFloat(royaltyOutstanding.toFixed(2)),
      
      // Receivables
      pendingReceivables: parseFloat(pendingReceivables.toFixed(2)),
      advancesGiven: parseFloat(advancesGiven.toFixed(2)),
      workingCapital: parseFloat(workingCapital.toFixed(2))
    });
  } catch (error) {
    console.error('Dashboard KPIs error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard KPIs' });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = [];

    // Check royalty balance alerts
    const royaltyStocks = await prisma.royaltyStock.findMany({
      where: { status: 'ACTIVE' }
    });

    const totalRemaining = royaltyStocks.reduce((sum, stock) => sum + stock.remainingCubicMeters, 0);
    
    if (totalRemaining < 100) {
      alerts.push({
        type: 'ROYALTY_LOW',
        message: `Royalty balance critically low: ${totalRemaining.toFixed(1)} cubic meters remaining`,
        severity: 'error'
      });
    } else if (totalRemaining < 200) {
      alerts.push({
        type: 'ROYALTY_WARNING',
        message: `Royalty balance low: ${totalRemaining.toFixed(1)} cubic meters remaining`,
        severity: 'warning'
      });
    }

    // Check for overdue payments
    const overdueQuarryPayments = await calculateOverduePayments('QUARRY');
    const overdueTransporterPayments = await calculateOverduePayments('TRANSPORTER');
    
    if (overdueQuarryPayments > 50000) {
      alerts.push({
        type: 'OVERDUE_QUARRY',
        message: `Overdue quarry payments: ₹${overdueQuarryPayments.toLocaleString()}`,
        severity: 'warning'
      });
    }

    if (overdueTransporterPayments > 50000) {
      alerts.push({
        type: 'OVERDUE_TRANSPORTER',
        message: `Overdue transporter payments: ₹${overdueTransporterPayments.toLocaleString()}`,
        severity: 'warning'
      });
    }

    // Check for expiring royalty stock
    const expiringStock = await prisma.royaltyStock.findMany({
      where: {
        status: 'ACTIVE',
        expiryDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      }
    });

    if (expiringStock.length > 0) {
      alerts.push({
        type: 'ROYALTY_EXPIRING',
        message: `${expiringStock.length} royalty stock(s) expiring within 30 days`,
        severity: 'warning'
      });
    }

    res.json(alerts);
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

exports.getRoyaltyBalance = async (req, res) => {
  try {
    const royaltyStocks = await prisma.royaltyStock.findMany({
      where: { status: 'ACTIVE' }
    });

    const totalPurchased = royaltyStocks.reduce((sum, stock) => sum + stock.purchasedCubicMeters, 0);
    const totalUsed = royaltyStocks.reduce((sum, stock) => sum + stock.usedCubicMeters, 0);
    const totalRemaining = royaltyStocks.reduce((sum, stock) => sum + stock.remainingCubicMeters, 0);
    
    const usagePercentage = totalPurchased > 0 ? ((totalUsed / totalPurchased) * 100) : 0;

    res.json({
      total: parseFloat(totalPurchased.toFixed(2)),
      used: parseFloat(totalUsed.toFixed(2)),
      remaining: parseFloat(totalRemaining.toFixed(2)),
      usagePercentage: parseFloat(usagePercentage.toFixed(1)),
      stocks: royaltyStocks.map(stock => ({
        id: stock.id,
        purchaseDate: stock.purchaseDate,
        remaining: stock.remainingCubicMeters,
        rate: stock.ratePerCubicMeter,
        expiryDate: stock.expiryDate
      }))
    });
  } catch (error) {
    console.error('Royalty balance error:', error);
    res.status(500).json({ error: 'Failed to fetch royalty balance' });
  }
};

exports.getTodayPendingPayments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's trips that need payments
    const todayTrips = await prisma.trip.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        quarry: true,
        transporter: true,
        quarryPayments: true,
        transporterPayments: true
      }
    });

    const pendingPayments = [];

    todayTrips.forEach(trip => {
      // Check quarry payment
      const quarryPaid = trip.quarryPayments.reduce((sum, payment) => sum + payment.amount, 0);
      if (quarryPaid < trip.materialCost) {
        pendingPayments.push({
          partyType: 'Quarry Owner',
          partyName: trip.quarry.name,
          vehicleOrQuarry: trip.quarry.location,
          tonnage: trip.tonnage,
          amount: trip.materialCost - quarryPaid,
          status: 'Pending',
          tripId: trip.id
        });
      }

      // Check transporter payment
      const transporterPaid = trip.transporterPayments.reduce((sum, payment) => sum + payment.amount, 0);
      if (transporterPaid < trip.transportCost) {
        pendingPayments.push({
          partyType: 'Vehicle Owner',
          partyName: trip.transporter.ownerName,
          vehicleOrQuarry: trip.vehicleNo,
          tonnage: trip.tonnage,
          amount: trip.transportCost - transporterPaid,
          status: 'Pending',
          tripId: trip.id
        });
      }
    });

    res.json(pendingPayments);
  } catch (error) {
    console.error('Today pending payments error:', error);
    res.status(500).json({ error: 'Failed to fetch today pending payments' });
  }
};

// Helper functions
async function calculateQuarryOutstanding() {
  const trips = await prisma.trip.findMany({
    include: { quarryPayments: true }
  });
  
  return trips.reduce((total, trip) => {
    const paid = trip.quarryPayments.reduce((sum, payment) => sum + payment.amount, 0);
    return total + Math.max(0, trip.materialCost - paid);
  }, 0);
}

async function calculateTransporterOutstanding() {
  const trips = await prisma.trip.findMany({
    include: { transporterPayments: true }
  });
  
  return trips.reduce((total, trip) => {
    const paid = trip.transporterPayments.reduce((sum, payment) => sum + payment.amount, 0);
    return total + Math.max(0, trip.transportCost - paid);
  }, 0);
}

async function calculateRoyaltyOutstanding() {
  // Calculate royalty costs for trips that haven't been paid to government
  const trips = await prisma.trip.findMany({
    include: { royaltyUsage: true }
  });
  
  return trips.reduce((total, trip) => {
    const royaltyCost = trip.cubicMetersUsed * 245; // Average royalty rate
    // Simplified: assume all royalty is outstanding until government payment is made
    return total + royaltyCost;
  }, 0);
}

async function calculatePendingReceivables() {
  const trips = await prisma.trip.findMany({
    include: { customerPayments: true }
  });
  
  return trips.reduce((total, trip) => {
    const received = trip.customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
    return total + Math.max(0, trip.sellingPrice - received);
  }, 0);
}

async function calculateAdvancesGiven() {
  const advances = await prisma.advance.findMany({
    where: { status: 'ACTIVE' }
  });
  
  return advances.reduce((sum, advance) => sum + advance.remainingBalance, 0);
}

async function calculateOverduePayments(partyType) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  if (partyType === 'QUARRY') {
    const overdueTrips = await prisma.trip.findMany({
      where: {
        date: { lt: sevenDaysAgo }
      },
      include: { quarryPayments: true }
    });
    
    return overdueTrips.reduce((total, trip) => {
      const paid = trip.quarryPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return total + Math.max(0, trip.materialCost - paid);
    }, 0);
  } else {
    const overdueTrips = await prisma.trip.findMany({
      where: {
        date: { lt: sevenDaysAgo }
      },
      include: { transporterPayments: true }
    });
    
    return overdueTrips.reduce((total, trip) => {
      const paid = trip.transporterPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return total + Math.max(0, trip.transportCost - paid);
    }, 0);
  }
}

exports.getDailySummary = async (req, res) => {
  const { date } = req.query;
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);
  
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  try {
    const trips = await prisma.trip.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDay
        }
      },
      include: {
        quarry: true,
        transporter: true
      }
    });

    const summary = {
      date: targetDate.toISOString().split('T')[0],
      totalTrips: trips.length,
      totalTonnage: trips.reduce((sum, trip) => sum + trip.tonnage, 0),
      totalRevenue: trips.reduce((sum, trip) => sum + trip.sellingPrice, 0),
      totalCosts: trips.reduce((sum, trip) => sum + trip.materialCost + trip.transportCost, 0),
      totalProfit: trips.reduce((sum, trip) => sum + trip.profit, 0),
      breakdown: trips.map(trip => ({
        tripId: trip.id,
        quarry: trip.quarry.name,
        vehicle: trip.vehicleNo,
        tonnage: trip.tonnage,
        profit: trip.profit
      }))
    };

    res.json(summary);
  } catch (error) {
    console.error('Daily summary error:', error);
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
};

exports.getMonthlyReport = async (req, res) => {
  const { year, month } = req.query;
  const currentYear = year || new Date().getFullYear();
  const currentMonth = month || new Date().getMonth() + 1;
  
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0);

  try {
    const trips = await prisma.trip.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const monthlyStats = {
      month: `${startDate.toLocaleString('default', { month: 'long' })} ${currentYear}`,
      totalTrips: trips.length,
      totalTonnage: trips.reduce((sum, trip) => sum + trip.tonnage, 0),
      totalRevenue: trips.reduce((sum, trip) => sum + trip.sellingPrice, 0),
      totalProfit: trips.reduce((sum, trip) => sum + trip.profit, 0),
      avgProfitPerTrip: trips.length > 0 ? trips.reduce((sum, trip) => sum + trip.profit, 0) / trips.length : 0
    };

    res.json(monthlyStats);
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly report' });
  }
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