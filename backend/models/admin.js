const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  adminName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Admin name already exists'
    },
    validate: { 
      notEmpty: {
        msg: 'Admin name is required'
      },
      len: {
        args: [3, 50],
        msg: 'Admin name must be between 3 and 50 characters'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6],
        msg: 'Password must be at least 6 characters long'
      },
      notEmpty: {
        msg: 'Password is required'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin', 'moderator'),
    allowNull: true,
    defaultValue: 'admin',
    // validate: {
    //   isIn: {
    //     args: [['superadmin', 'admin', 'moderator']],
    //     msg: 'Role must be one of: superadmin, admin, or moderator'
    //   }
    // }
  }
}, {
  tableName: 'admins',
  timestamps: true
});

module.exports = Admin;
