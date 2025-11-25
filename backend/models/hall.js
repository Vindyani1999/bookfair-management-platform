const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Hall = sequelize.define('Hall', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Hall name already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Hall name is required'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
	type: DataTypes.ENUM('booked', 'available', 'unavailable'),
	allowNull: false,
	defaultValue: 'available'
  },
  imageUrl: {
    type: DataTypes.STRING, // Cloudinary URL
    allowNull: true
  }
}, {
  tableName: 'halls',
  timestamps: true
});

module.exports = Hall;
