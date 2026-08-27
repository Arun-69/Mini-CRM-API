const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/stats', DashboardController.getDashboardStats);

module.exports = router;