const sequelize = require('../config/database');
const User = require('./User');
const Todo = require('./Todo');
const Stamp = require('./Stamp');
const StampHistory = require('./StampHistory');
const HallOfFame = require('./HallOfFame');
const PasswordReset = require('./PasswordReset');

User.hasMany(Todo, { foreignKey: 'userId' });
Todo.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Stamp, { foreignKey: 'userId' });
Stamp.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(StampHistory, { foreignKey: 'userId' });
StampHistory.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(HallOfFame, { foreignKey: 'userId' });
HallOfFame.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(PasswordReset, { foreignKey: 'userId' });
PasswordReset.belongsTo(User, { foreignKey: 'userId' });

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synced');
};

module.exports = { sequelize, syncDatabase, User, Todo, Stamp, StampHistory, HallOfFame, PasswordReset };
