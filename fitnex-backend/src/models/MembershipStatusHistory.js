const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Membership = require('./Membership');
const User = require('./User');

const MembershipStatusHistory = sequelize.define('MembershipStatusHistory', {
  history_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  membership_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'memberships',
      key: 'membership_id'
    },
    onDelete: 'CASCADE'
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
  previous_status: {
    type: DataTypes.ENUM('Active', 'On Hold', 'Inactive'),
    allowNull: true
  },
  new_status: {
    type: DataTypes.ENUM('Active', 'On Hold', 'Inactive'),
    allowNull: false
  },
  reason: {
    type: DataTypes.ENUM('payment_delay', 'rule_violation', 'medical_leave', 'member_request', 'other'),
    allowNull: true
  },
  reason_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  changed_by_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  changed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'membership_status_history',
  timestamps: false
});

MembershipStatusHistory.belongsTo(Membership, { foreignKey: 'membership_id', onDelete: 'CASCADE' });
Membership.hasMany(MembershipStatusHistory, { foreignKey: 'membership_id', onDelete: 'CASCADE' });
MembershipStatusHistory.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
MembershipStatusHistory.belongsTo(User, { as: 'changed_by', foreignKey: 'changed_by_user_id' });

module.exports = MembershipStatusHistory;
