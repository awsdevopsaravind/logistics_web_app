const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// Add new trip
router.post('/', tripsController.createTrip);
// Get trips with filters
router.get('/', tripsController.getTrips);
// Update trip
router.put('/:id', tripsController.updateTrip);
// Delete trip
router.delete('/:id', tripsController.deleteTrip);
// Get trip summaries
router.get('/summary', tripsController.getTripSummary);

module.exports = router; 