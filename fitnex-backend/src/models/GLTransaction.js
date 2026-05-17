const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Tenant = require('./Tenant');
const GLAccount = require('./GLAccount');

const GLTransaction = sequelize.define('GLTransaction', {
  transaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  debit_account_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'gl_accounts',
      key: 'account_id'
    }
  },
  credit_account_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'gl_accounts',
      key: 'account_id'
    }
  },
  transaction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  source_reference_id: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'gl_transactions',
  timestamps: false
});

GLTransaction.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
GLTransaction.belongsTo(GLAccount, { as: 'debitAccount', foreignKey: 'debit_account_id' });
GLTransaction.belongsTo(GLAccount, { as: 'creditAccount', foreignKey: 'credit_account_id' });
Tenant.hasMany(GLTransaction, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

module.exports = GLTransaction;
