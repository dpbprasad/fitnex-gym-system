const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Tenant = require('./Tenant');

const AttendanceLog = sequelize.define('AttendanceLog', {
  log_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    },
    onDelete: 'CASCADE'
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'tenant_id'
    },
    onDelete: 'CASCADE'
  },
  event_type: {
    type: DataTypes.ENUM('check-in', 'check-out'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'attendance_logs',
  timestamps: false
});

AttendanceLog.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
AttendanceLog.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
User.hasMany(AttendanceLog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Tenant.hasMany(AttendanceLog, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

module.exports = AttendanceLog;
