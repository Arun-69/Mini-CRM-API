const Lead = require('../models/Lead');
const Task = require('../models/Task');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total Leads
    const totalLeads = await Lead.countDocuments({ createdBy: userId });

    // Qualified Leads
    const qualifiedLeads = await Lead.countDocuments({ 
      createdBy: userId,
      status: 'qualified' 
    });

    // Tasks Due Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksDueToday = await Task.countDocuments({
      $or: [{ assignedTo: userId }, { assignedBy: userId }],
      dueDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $ne: 'completed' }
    });

    // Completed Tasks
    const completedTasks = await Task.countDocuments({
      $or: [{ assignedTo: userId }, { assignedBy: userId }],
      status: 'completed'
    });

    res.json({
      totalLeads,
      qualifiedLeads,
      tasksDueToday,
      completedTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};