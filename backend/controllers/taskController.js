import Task from "../models/Task.js";

// Create task
export const createTask = async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    completed: false,
    user: req.user.id,
  });

  // 🔥 Real-time emit
  req.io.emit("taskCreated", task);

  res.status(201).json(task);
};

// Get all tasks
export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

// Update task
export const updateTask = async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // 🔥 Real-time emit
  req.io.emit("taskUpdated", updated);

  res.json(updated);
};

// Delete task
export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  // 🔥 Real-time emit
  req.io.emit("taskDeleted", req.params.id);

  res.status(204).send();
};
