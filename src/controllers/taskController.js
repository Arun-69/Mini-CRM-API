const TaskService = require('../services/taskService');

class TaskController {
  // Create task
  async createTask(req, res) {
    try {
      const task = await TaskService.createTask(req.body, req.user._id);
      res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Get all tasks
  async getTasks(req, res) {
    try {
      const result = await TaskService.getTasks(req.query, req.user._id);
      res.json({
        status: 'success',
        ...result
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Get single task
  async getTask(req, res) {
    try {
      const task = await TaskService.getTask(req.params.id, req.user._id);
      res.json({
        status: 'success',
        task
      });
    } catch (error) {
      console.error('Get task error:', error);
      if (error.message === 'Task not found or access denied') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Update task status
  async updateTaskStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          status: 'error',
          message: 'Status is required'
        });
      }

      const task = await TaskService.updateTaskStatus(req.params.id, status, req.user._id);
      res.json({
        status: 'success',
        message: 'Task status updated successfully',
        task
      });
    } catch (error) {
      console.error('Update task status error:', error);
      if (error.message === 'You are not authorized to update this task status') {
        return res.status(403).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Update task
  async updateTask(req, res) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body, req.user._id);
      res.json({
        status: 'success',
        message: 'Task updated successfully',
        task
      });
    } catch (error) {
      console.error('Update task error:', error);
      if (error.message === 'Task not found or access denied') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new TaskController();