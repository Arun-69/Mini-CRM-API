const Task = require('../models/Task');
const LeadService = require('./leadService');

class TaskService {
  // Create task
  async createTask(taskData, userId) {
    const lead = await LeadService.getLead(taskData.lead, userId);

    const data = {
      title: taskData.title,
      lead: taskData.lead,
      assignedTo: taskData.assignedTo,
      assignedBy: userId,
      dueDate: taskData.dueDate || null
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

  // Update task status - Only assigned users can update
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

    // Only allow updating specific fields
    if (updateData.title) task.title = updateData.title;
    if (updateData.lead) task.lead = updateData.lead;
    if (updateData.assignedTo) task.assignedTo = updateData.assignedTo;
    if (updateData.dueDate) task.dueDate = updateData.dueDate;

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
}

module.exports = new TaskService();