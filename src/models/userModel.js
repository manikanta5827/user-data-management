const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('USER', 'ADMIN'),
      defaultValue: 'USER',
      validate: {
        isIn: [['USER', 'ADMIN']]
      }
    }
  },
  {
    tableName: 'users', // Explicitly set table name to lowercase
    freezeTableName: true,
    timestamps: true,
    underscored: true, // Use snake_case for column names
  }
);

module.exports = User; 