import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';
import { io } from '../server.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get all tasks of the logged-in user
router.get('/', auth, async (req, res) => {
  // Sort by order ascending, then by creation date
  const tasks = await Task.find({ user: req.user.id }).sort({ order: 1, createdAt: 1 });
  res.json(tasks);
});

// ✅ Create new task
router.post('/', auth, async (req, res) => {
  const { title, category, dueDate, subtasks } = req.body;
  
  // Find the highest order to append to the bottom
  const maxOrderTask = await Task.findOne({ user: req.user.id }).sort('-order');
  const nextOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

  const task = await Task.create({
    title,
    user: req.user.id,
    completed: false,
    category: category || 'General',
    dueDate: dueDate ? new Date(dueDate) : null,
    subtasks: subtasks || [],
    order: nextOrder
  });

  // Real-time emit
  if (io) {
    io.emit('taskCreated', task); 
  }
  
  res.status(201).json(task);
});

// ✅ Batch Update task order (for drag and drop)
router.put('/reorder', auth, async (req, res) => {
  const { reorderedTasks } = req.body; 
  // reorderedTasks should be an array of objects: { _id: "...", order: 1 }

  try {
    const updatePromises = reorderedTasks.map(task => 
      Task.findByIdAndUpdate(task._id, { order: task.order })
    );
    await Promise.all(updatePromises);
    
    // Broadcast the reorder event
    if (io) {
      io.emit('tasksReordered', reorderedTasks);
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder tasks', error: error.message });
  }
});

// ✅ Update task
router.put('/:id', protect, async (req, res) => {
  const taskToUpdate = await Task.findById(req.params.id);
  
  if (!taskToUpdate) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Handle completedAt logic
  const isNowCompleted = req.body.completed === true && !taskToUpdate.completed;
  const isNowUncompleted = req.body.completed === false && taskToUpdate.completed;

  if (isNowCompleted) {
    req.body.completedAt = new Date();
  } else if (isNowUncompleted) {
    req.body.completedAt = null;
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (updatedTask) {
    if (req.io) {
      req.io.emit('taskUpdated', updatedTask); // Emit updated task
    } else if (io) {
      io.emit('taskUpdated', updatedTask);
    }
    res.json(updatedTask);
  }
});

// ✅ Delete task
router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    if (req.io) {
      req.io.emit('taskDeleted', req.params.id); 
    } else if (io) {
      io.emit('taskDeleted', req.params.id);
    }
    res.json({ message: 'Deleted' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

export default router;
