const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Todo = sequelize.define('Todo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.STRING(500) },
  priority: { type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'), defaultValue: 'MEDIUM' },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  completedAt: { type: DataTypes.DATE },
});

module.exports = Todo;
