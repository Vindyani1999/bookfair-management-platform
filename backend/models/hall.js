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
	location: {
		type: DataTypes.STRING,
		allowNull: true
	},
	capacity: {
		type: DataTypes.INTEGER,
		allowNull: true,
		validate: {
			min: 0
		}
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true
	}
}, {
	tableName: 'halls',
	timestamps: true
});

module.exports = Hall;
