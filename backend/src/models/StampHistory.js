const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StampHistory = sequelize.define('StampHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  stampDate: { type: DataTypes.DATEONLY, allowNull: false },
});

module.exports = StampHistory;
