require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hallRoutes = require('./routes/hallRoutes');
const stallRoutes = require('./routes/stallRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const cors = require("cors");
const app = express();

app.use(express.json());

app.use(
   cors({
      origin: "*",
      methods: "*",
      credentials: true,
   })
);

app.get("/", (req, res) => res.send("SIB-RMS Backend is running"));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/hall', hallRoutes);
app.use('/api/v1/stall', stallRoutes);
app.use('/api/v1/transaction', transactionRoutes);
app.use('/api/v1/reservation', reservationRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log("Database synced");

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
