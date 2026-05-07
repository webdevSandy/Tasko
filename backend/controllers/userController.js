import User from '../models/User.js';

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      
      if (req.body.preferences) {
        user.preferences = {
          emailNotifications: req.body.preferences.emailNotifications !== undefined ? req.body.preferences.emailNotifications : user.preferences.emailNotifications,
          pushNotifications: req.body.preferences.pushNotifications !== undefined ? req.body.preferences.pushNotifications : user.preferences.pushNotifications,
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        preferences: updatedUser.preferences,
        createdAt: updatedUser.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
