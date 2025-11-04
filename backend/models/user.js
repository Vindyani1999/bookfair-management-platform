const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    contactPerson: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Contact person name is required'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already exists'
    },
    validate: {
      isEmail: {
        msg: 'Invalid email format'
      },
      notEmpty: {
        msg: 'Email is required'
      }
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number is required'
      },
      is: {
        args: [/^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/],
        msg: 'Phone number must be in format +94 XX XXX XXXX'
      }
    }
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: {
      msg: 'Business name already exists'
    }
  },
  businessAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6],
        msg: 'Password must be at least 6 characters'
      },
      notEmpty: {
        msg: 'Password is required'
      }
    }
  }

}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
