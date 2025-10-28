require('dotenv').config();
const express = require('express');
//const cors = require('cors');

const app = express();
//app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('SIB-RMS Backend is running'));

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();

  await sequelize.sync({ alter: true }); 
  console.log('Database synced');

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
