import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';
import { io } from '../server.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get all tasks of the logged-in user
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// ✅ Create new task
router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  const task = await Task.create({
  title,
  user: req.user.id,
  completed: false
});
io.emit('taskCreated', task); // ✅ Real-time emit
res.status(201).json(task);
});

// ✅ Update task
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (task) {
    req.io.emit('taskUpdated', task); // ✅ Emit updated task
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// ✅ Delete task
router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    req.io.emit('taskDeleted', req.params.id);  // ✅ Emit event
    res.json({ message: 'Deleted' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

export default router;
