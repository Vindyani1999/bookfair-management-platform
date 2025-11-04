const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Stall = sequelize.define('Stall', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	number: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'Stall number is required'
			}
		}
	},
	name: {
		type: DataTypes.STRING,
		allowNull: true
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
	size: {
		type: DataTypes.STRING,
		allowNull: true
	},
	price: {
		type: DataTypes.DECIMAL(10,2),
		allowNull: true,
		validate: {
			min: 0
		}
	},
	status: {
		type: DataTypes.ENUM('available','reserved','occupied'),
		allowNull: false,
		defaultValue: 'available'
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true
	}
}, {
	tableName: 'stalls',
	timestamps: true
});

module.exports = Stall;
