const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const EmergencyContact = sequelize.define('EmergencyContact', {
  contact_id: {
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  relationship: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contact_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'emergency_contacts',
  timestamps: false
});

EmergencyContact.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(EmergencyContact, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = EmergencyContact;
