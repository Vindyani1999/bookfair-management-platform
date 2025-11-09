const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Resevation = sequelize.define('Resevation', {
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
    hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'halls',
            key: 'id'
        }
    },
    stallIds: {
        type: DataTypes.JSON, // ✅ use JSON instead of ARRAY
        allowNull: true,
        defaultValue: [] // ✅ default to empty array
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    businessName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    businessAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'reservations',
    timestamps: true
});

module.exports = Resevation;