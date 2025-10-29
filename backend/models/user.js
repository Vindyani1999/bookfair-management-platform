const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Business name already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Business name is required'
      }
    }
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
  businessAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Business address is required'
      }
    }
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
