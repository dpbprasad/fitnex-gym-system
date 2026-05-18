const Tenant = require('./Tenant');
const User = require('./User');
const Membership = require('./Membership');
const AttendanceLog = require('./AttendanceLog');
const GLAccount = require('./GLAccount');
const GLTransaction = require('./GLTransaction');
const Payment = require('./Payment');
const HealthDeclaration = require('./HealthDeclaration');
const EmergencyContact = require('./EmergencyContact');
const MembershipStatusHistory = require('./MembershipStatusHistory');

// Setup associations
User.hasOne(HealthDeclaration, { foreignKey: 'user_id', as: 'healthDeclaration' });
HealthDeclaration.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(EmergencyContact, { foreignKey: 'user_id', as: 'emergencyContacts' });
EmergencyContact.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Membership.hasMany(MembershipStatusHistory, { foreignKey: 'membership_id', as: 'statusHistory' });
MembershipStatusHistory.belongsTo(Membership, { foreignKey: 'membership_id', as: 'membership' });

module.exports = {
  Tenant,
  User,
  Membership,
  AttendanceLog,
  GLAccount,
  GLTransaction,
  Payment,
  HealthDeclaration,
  EmergencyContact,
  MembershipStatusHistory
};
