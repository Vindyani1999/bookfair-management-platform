const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Stall = sequelize.define('Stall', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Stall name is required'
            },
            isUppercase: {
                msg: 'Stall name must be uppercase'
            },
            is: {
                args: /^[A-Z]$/,
                msg: 'Stall name must be a single letter from A to Z'
            },
            customValidation(value) {
                if (value && (value.length !== 1 || !/^[A-Z]$/.test(value))) {
                    throw new Error('Stall name must be a single uppercase letter (A-Z)');
                }
            }
        }
    },
    hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'halls',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    size: {
        type: DataTypes.ENUM('small', 'medium', 'large'),
        allowNull: false,
        defaultValue: 'small'
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'stalls',
    timestamps: true,
});

module.exports = Stall;
