const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully using Sequelize');
  } catch (err) {
    console.error('Unable to connect to MySQL:', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };


// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// // ✅ Connect using DATABASE_URL (recommended for Railway)
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'mysql',
//   logging: false,
//   dialectOptions: {
//     connectTimeout: 60000, // helps with Railway connection delay
//   },
// });

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ MySQL connected successfully to Railway using Sequelize');
//   } catch (error) {
//     console.error('❌ Unable to connect to MySQL:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = { sequelize, connectDB };
