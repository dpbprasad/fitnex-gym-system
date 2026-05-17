const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Tenant = require('./Tenant');

const GLAccount = sequelize.define('GLAccount', {
  account_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  account_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  account_type: {
    type: DataTypes.ENUM('Asset', 'Liability', 'Equity', 'Revenue', 'Expense'),
    allowNull: false
  },
  normal_balance: {
    type: DataTypes.ENUM('Debit', 'Credit'),
    allowNull: false
  }
}, {
  tableName: 'gl_accounts',
  timestamps: false
});

GLAccount.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Tenant.hasMany(GLAccount, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

module.exports = GLAccount;
