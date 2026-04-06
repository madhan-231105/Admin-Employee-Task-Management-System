const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const router = express.Router();

// Middleware to check if Admin (Simplified for this step)
const isAdmin = async (req, res, next) => {
  // In a real app, verify JWT here. For now, we assume frontend sends headers.
  next(); 
};

// Get all employees
router.get('/employees', async (req, res) => {
  const employees = await User.find({ role: 'employee' });
  res.json(employees);
});

// Approve Employee
router.patch('/approve/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isApproved: true });
  res.json({ message: "Employee approved successfully" });
});

// Create Task
router.post('/tasks', async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const task = await Task.create({ title, description, assignedTo });
  res.status(201).json(task);
});

module.exports = router;