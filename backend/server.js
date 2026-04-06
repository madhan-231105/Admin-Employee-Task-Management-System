const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Seed Admin Logic
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@system.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'System Admin',
        email: 'admin@system.com',
        password: hashedPassword,
        role: 'admin',
        isApproved: true
      });
      console.log('✅ Default Admin Created: admin@system.com / admin123');
    }
  } catch (err) { console.log(err); }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🚀 Connected to MongoDB');
    seedAdmin();
  })
  .catch(err => console.log(err));

// Routes (To be imported from separate files)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server on port ${PORT}`));