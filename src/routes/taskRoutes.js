const express = require('express');
const TaskController = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTask);
router.patch('/:id/status', TaskController.updateTaskStatus);
router.put('/:id', TaskController.updateTask);

module.exports = router;