require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const hallRoutes = require('./routes/hallRoutes');
const stallRoutes = require('./routes/stallRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => res.send('SIB-RMS Backend is running'));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/halls', hallRoutes);
app.use('/api/v1/stalls', stallRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log('Database synced');

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
