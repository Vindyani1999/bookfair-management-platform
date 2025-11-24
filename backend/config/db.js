
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 60000, 
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully to Railway using Sequelize');
  } catch (error) {
    console.error('Unable to connect to MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };



// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// //Connect using DATABASE_URL (recommended for Railway)
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'mysql',
//   logging: false,
//   dialectOptions: {
//     connectTimeout: 60000, 
//   },
// });

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('MySQL connected successfully to Railway using Sequelize');
//   } catch (error) {
//     console.error('Unable to connect to MySQL:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = { sequelize, connectDB };

