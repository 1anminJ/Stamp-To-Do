const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stamp = sequelize.define('Stamp', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  stampCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastAchievedDate: { type: DataTypes.DATEONLY },
});

module.exports = Stamp;
