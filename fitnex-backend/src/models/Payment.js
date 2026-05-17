const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Membership = require('./Membership');
const Tenant = require('./Tenant');
const User = require('./User');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  membership_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'memberships',
      key: 'membership_id'
    }
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING(50),
    defaultValue: 'Cash'
  },
  processed_by_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'payments',
  timestamps: false
});

Payment.belongsTo(Membership, { foreignKey: 'membership_id' });
Payment.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Payment.belongsTo(User, { as: 'processedBy', foreignKey: 'processed_by_user_id' });
Membership.hasMany(Payment, { foreignKey: 'membership_id' });
Tenant.hasMany(Payment, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

module.exports = Payment;
