const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const TwitterUser = sequelize.define('TwitterUser', {
    twitterId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tokenSecret: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'twitter_users',
    timestamps: true
});

module.exports = TwitterUser;
