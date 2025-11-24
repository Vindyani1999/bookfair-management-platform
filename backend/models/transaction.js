const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reservations',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sessionUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'transactions',
    timestamps: true,
    indexes: [
  { fields: ['sessionId'] }
]
});

module.exports = Transaction;