const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');

// 1. Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. THIS IS THE MISSING ROUTE CAUSING THE 404
router.get('/tasks/all', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name') // This makes sure we see the employee name
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Approve Employee
router.patch('/approve/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Create Task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo, priority } = req.body;
    const newTask = await Task.create({ 
        title, 
        description, 
        assignedTo, 
        priority: priority || 'medium',
        status: 'Pending'
    });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;