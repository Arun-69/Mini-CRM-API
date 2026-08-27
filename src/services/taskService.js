const Task = require('../models/Task');
const LeadService = require('./leadService');

class TaskService {
  // Create task
  async createTask(taskData, userId) {
    // Check if lead exists and user has access
    const lead = await LeadService.getLead(taskData.lead, userId);

    const data = {
      ...taskData,
      assignedBy: userId
    };

    const task = new Task(data);
    await task.save();
    await task.populate(['lead', 'assignedTo', 'assignedBy']);

    return task;
  }

  // Get all tasks with pagination and filters
  async getTasks(filters, userId) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    // Users can see tasks assigned to them or created by them
    const filter = {
      $or: [
        { assignedTo: userId },
        { assignedBy: userId }
      ]
    };

    // Status filter
    if (filters.status) {
      filter.status = filters.status;
    }

    // Lead filter
    if (filters.lead) {
      filter.lead = filters.lead;
    }

    // Priority filter
    if (filters.priority) {
      filter.priority = filters.priority;
    }

    // Search by title
    if (filters.search) {
      filter.title = { $regex: filters.search, $options: 'i' };
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('lead', 'name email')
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter)
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get single task
  async getTask(taskId, userId) {
    const task = await Task.findOne({
      _id: taskId,
      $or: [
        { assignedTo: userId },
        { assignedBy: userId }
      ]
    }).populate(['lead', 'assignedTo', 'assignedBy']);

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    return task;
  }

  // Update task status
  async updateTaskStatus(taskId, status, userId) {
    // Check if user is assigned to this task
    const task = await Task.findOne({
      _id: taskId,
      assignedTo: userId
    });

    if (!task) {
      throw new Error('You are not authorized to update this task status');
    }

    task.status = status;
    await task.save();
    await task.populate(['lead', 'assignedTo', 'assignedBy']);

    return task;
  }

  // Update task
  async updateTask(taskId, updateData, userId) {
    const task = await Task.findOne({
      _id: taskId,
      $or: [
        { assignedTo: userId },
        { assignedBy: userId }
      ]
    });

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    // Check if lead exists if updating lead
    if (updateData.lead) {
      await LeadService.getLead(updateData.lead, userId);
    }

    Object.assign(task, updateData);
    await task.save();
    await task.populate(['lead', 'assignedTo', 'assignedBy']);

    return task;
  }

  // Get tasks by lead
  async getTasksByLead(leadId, userId) {
    const tasks = await Task.find({
      lead: leadId,
      $or: [
        { assignedTo: userId },
        { assignedBy: userId }
      ]
    }).populate('assignedTo', 'name email');

    return tasks;
  }

  // Get overdue tasks
  async getOverdueTasks(userId) {
    const tasks = await Task.find({
      $or: [{ assignedTo: userId }, { assignedBy: userId }],
      status: { $nin: ['completed', 'cancelled'] },
      dueDate: { $lt: new Date() }
    });

    return tasks;
  }

  // Get task statistics
  async getTaskStats(userId) {
    const totalTasks = await Task.countDocuments({
      $or: [{ assignedTo: userId }, { assignedBy: userId }]
    });

    const tasksByStatus = await Task.aggregate([
      {
        $match: {
          $or: [{ assignedTo: userId }, { assignedBy: userId }]
        }
      },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const completedTasks = tasksByStatus.find(t => t._id === 'completed')?.count || 0;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const overdueTasks = await this.getOverdueTasks(userId);

    return {
      totalTasks,
      taskCompletionRate,
      overdueTasksCount: overdueTasks.length,
      tasksByStatus: tasksByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  }
}

module.exports = new TaskService();