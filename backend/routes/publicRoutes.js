import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

// GET /api/public/stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });

    res.json({
      totalUsers,
      totalTasks,
      completedTasks,
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

export default router;
