const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Size category thresholds (in square meters)
const SIZE_CATEGORIES = {
    SMALL: { maxArea: 9 },     // Up to 9 sq meters (e.g., 3x3)
    MEDIUM: { maxArea: 16 },   // Up to 16 sq meters (e.g., 4x4)
    LARGE: { maxArea: 25 }     // Up to 25 sq meters (e.g., 5x5)
};

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
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    width: {
        type: DataTypes.DECIMAL(4,2),
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Width must be at least 1 meter'
            },
            max: {
                args: [5],
                msg: 'Width cannot exceed 5 meters'
            }
        }
    },
    length: {
        type: DataTypes.DECIMAL(4,2),
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Length must be at least 1 meter'
            },
            max: {
                args: [5],
                msg: 'Length cannot exceed 5 meters'
            }
        }
    },
    size: {
        type: DataTypes.ENUM('small', 'medium', 'large'),
        allowNull: false,
        defaultValue: 'small'
    },
    dimensions: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.width}x${this.length}`;
        }
    },
    area: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.width * this.length;
        }
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
    hooks: {
        beforeValidate: (stall) => {
            // Calculate size category based on area
            const area = stall.width * stall.length;
            if (area <= SIZE_CATEGORIES.SMALL.maxArea) {
                stall.size = 'small';
            } else if (area <= SIZE_CATEGORIES.MEDIUM.maxArea) {
                stall.size = 'medium';
            } else {
                stall.size = 'large';
            }
        }
    }
});

module.exports = Stall;
