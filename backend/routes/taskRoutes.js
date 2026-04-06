const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Get tasks for specific employee
router.get('/:userId', async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.params.userId });
  res.json(tasks);
});

// Update task status
router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(task);
});

module.exports = router;