const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Tenant = require('./Tenant');

const Membership = sequelize.define('Membership', {
  membership_id: {
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
  status: {
    type: DataTypes.ENUM('Active', 'On Hold', 'Inactive'),
    defaultValue: 'Inactive',
    allowNull: false
  },
  valid_from: {
    type: DataTypes.DATE,
    allowNull: true
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'memberships',
  timestamps: false
});

Membership.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Membership.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
User.hasOne(Membership, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Tenant.hasMany(Membership, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

module.exports = Membership;
