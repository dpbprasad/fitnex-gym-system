const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Tenant = require('./Tenant');

const User = sequelize.define('User', {
  user_id: {
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
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_set: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('owner', 'staff', 'member'),
    allowNull: false
  },
  // Personal Details
  id_type: {
    type: DataTypes.ENUM('NIC', 'Driving Licence', 'Passport'),
    allowNull: true
  },
  id_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  permanent_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  temporary_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contact_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  photo_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  // Guardian for under-18
  guardian_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  guardian_contact: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  guardian_signature: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Declaration
  declaration_signed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  declaration_signed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false
});

User.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Tenant.hasMany(User, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

module.exports = User;
