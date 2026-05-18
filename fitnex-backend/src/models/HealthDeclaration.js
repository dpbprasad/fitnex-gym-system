const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const HealthDeclaration = sequelize.define('HealthDeclaration', {
  declaration_id: {
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
  heart_condition: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  heart_condition_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  blood_pressure: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  blood_pressure_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  asthma: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  asthma_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  diabetes: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  diabetes_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  joint_injuries: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  joint_injuries_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recent_surgery: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  recent_surgery_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergies: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allergies_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pregnancy: {
    type: DataTypes.ENUM('Yes', 'No', 'Prefer not to say'),
    allowNull: true
  },
  pregnancy_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'health_declarations',
  timestamps: false
});

HealthDeclaration.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(HealthDeclaration, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = HealthDeclaration;
