const { User, Membership, HealthDeclaration, EmergencyContact, MembershipStatusHistory, sequelize } = require('../models');
const { hashPassword, generateToken } = require('../utils/crypto');
const EmailService = require('../services/EmailService');

class MemberController {
  static async createMember(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { tenantId } = req.params;
      const {
        // Personal Details
        email,
        firstName,
        lastName,
        idType,
        idNumber,
        dateOfBirth,
        gender,
        weight,
        height,
        permanentAddress,
        temporaryAddress,
        contactNumber,
        photoUrl,
        // Guardian for under-18
        guardianName,
        guardianContact,
        guardianSignature,
        // Declaration
        declarationSigned,
        signature,
        // Health Declaration
        healthDeclaration,
        // Emergency Contacts
        emergencyContacts
      } = req.body;

      if (!email || !firstName || !lastName || !idType || !idNumber || !dateOfBirth || !gender || !contactNumber) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      // Check for duplicate ID number
      const existingIdUser = await User.findOne({ 
        where: { id_number: idNumber },
        transaction
      });
      if (existingIdUser) {
        return res.status(409).json({ error: 'ID number already registered' });
      }

      // Check for duplicate email
      const existingEmailUser = await User.findOne({ 
        where: { email },
        transaction
      });
      if (existingEmailUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Calculate age from date of birth
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      // Check if under 18 and require guardian
      const isUnder18 = age < 18;
      if (isUnder18 && (!guardianName || !guardianContact || !guardianSignature)) {
        return res.status(400).json({ error: 'Guardian details required for members under 18' });
      }

      // Create user with password not set (will be set via email)
      const user = await User.create({
        tenant_id: tenantId,
        email,
        password_hash: null,
        password_set: false,
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        role: 'member',
        id_type: idType,
        id_number: idNumber,
        date_of_birth: dateOfBirth,
        age: age,
        gender: gender,
        weight: weight,
        height: height,
        permanent_address: permanentAddress,
        temporary_address: temporaryAddress || null,
        contact_number: contactNumber,
        photo_url: photoUrl || null,
        guardian_name: isUnder18 ? guardianName : null,
        guardian_contact: isUnder18 ? guardianContact : null,
        guardian_signature: isUnder18 ? guardianSignature : false,
        declaration_signed: declarationSigned || false,
        declaration_signed_at: declarationSigned ? new Date() : null,
        signature_url: signature || null
      }, { transaction });

      // Create membership
      const membership = await Membership.create({
        user_id: user.user_id,
        tenant_id: tenantId,
        status: 'Inactive'
      }, { transaction });

      // Create health declaration if provided
      if (healthDeclaration) {
        await HealthDeclaration.create({
          user_id: user.user_id,
          heart_condition: healthDeclaration.heartCondition || false,
          heart_condition_details: healthDeclaration.heartConditionDetails || null,
          blood_pressure: healthDeclaration.bloodPressure || false,
          blood_pressure_details: healthDeclaration.bloodPressureDetails || null,
          asthma: healthDeclaration.asthma || false,
          asthma_details: healthDeclaration.asthmaDetails || null,
          diabetes: healthDeclaration.diabetes || false,
          diabetes_details: healthDeclaration.diabetesDetails || null,
          joint_injuries: healthDeclaration.jointInjuries || false,
          joint_injuries_details: healthDeclaration.jointInjuriesDetails || null,
          recent_surgery: healthDeclaration.recentSurgery || false,
          recent_surgery_details: healthDeclaration.recentSurgeryDetails || null,
          allergies: healthDeclaration.allergies || false,
          allergies_details: healthDeclaration.allergiesDetails || null,
          pregnancy: healthDeclaration.pregnancy || null,
          pregnancy_details: healthDeclaration.pregnancyDetails || null
        }, { transaction });
      }

      // Create emergency contacts if provided
      if (emergencyContacts && Array.isArray(emergencyContacts)) {
        for (const contact of emergencyContacts) {
          await EmergencyContact.create({
            user_id: user.user_id,
            name: contact.name,
            relationship: contact.relationship,
            contact_number: contact.contactNumber
          }, { transaction });
        }
      }

      await transaction.commit();

      // Send account setup email (graceful - won't fail if not configured)
      const setupToken = generateToken({ userId: user.user_id, email: user.email }, '24h');
      await EmailService.sendAccountSetupEmail(user.email, user.full_name, setupToken);

      res.status(201).json({
        message: 'Member created successfully',
        member: {
          userId: user.user_id,
          email: user.email,
          fullName: user.full_name,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          passwordSet: false // Indicates password needs to be set via email
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Create member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async listMembers(req, res) {
    try {
      const { tenantId } = req.params;

      const members = await User.findAll({
        where: {
          tenant_id: tenantId,
          role: 'member'
        },
        include: [{ model: Membership }],
        attributes: ['user_id', 'email', 'full_name', 'role', 'created_at']
      });

      res.json({ members });
    } catch (error) {
      console.error('List members error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMember(req, res) {
    try {
      const { tenantId, memberId } = req.params;

      const member = await User.findOne({
        where: {
          user_id: memberId,
          tenant_id: tenantId,
          role: 'member'
        },
        include: [{ model: Membership }],
        attributes: ['user_id', 'email', 'full_name', 'role', 'created_at']
      });

      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      res.json({ member });
    } catch (error) {
      console.error('Get member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateMemberStatus(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { tenantId, memberId } = req.params;
      const { status, reason, reasonDetails } = req.body;

      if (!['Active', 'On Hold', 'Inactive'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      if (status === 'On Hold' && !reason) {
        return res.status(400).json({ error: 'Reason required when placing membership on hold' });
      }

      const membership = await Membership.findOne({
        where: {
          user_id: memberId,
          tenant_id: tenantId
        },
        transaction
      });

      if (!membership) {
        return res.status(404).json({ error: 'Membership not found' });
      }

      const previousStatus = membership.status;

      // Update membership status
      await membership.update({ status }, { transaction });

      // Create status history record
      await MembershipStatusHistory.create({
        membership_id: membership.membership_id,
        user_id: memberId,
        previous_status: previousStatus,
        new_status: status,
        reason: reason || null,
        reason_details: reasonDetails || null,
        changed_by_user_id: req.user?.user_id || null
      }, { transaction });

      await transaction.commit();

      res.json({
        message: 'Membership status updated successfully',
        membership: {
          membershipId: membership.membership_id,
          status: membership.status
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Update member status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = MemberController;
