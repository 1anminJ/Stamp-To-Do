const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HallOfFame = sequelize.define('HallOfFame', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  displayName: { type: DataTypes.STRING, allowNull: false },
  achievementCount: { type: DataTypes.INTEGER, defaultValue: 1 },
  lastAchievedDate: { type: DataTypes.DATEONLY },
});

module.exports = HallOfFame;
