const DashboardService = require('../services/dashboardService');

class DashboardController {
  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const stats = await DashboardService.getDashboardStats(req.user._id);
      res.json({
        status: 'success',
        ...stats
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new DashboardController();