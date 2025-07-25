const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const tripsRoutes = require('./routes/trips');
const paymentsRoutes = require('./routes/payments');
const royaltyRoutes = require('./routes/royalty');
const analyticsRoutes = require('./routes/analytics');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Logistics Management System API is running.' });
});

app.use('/api/trips', tripsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/royalty', royaltyRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
