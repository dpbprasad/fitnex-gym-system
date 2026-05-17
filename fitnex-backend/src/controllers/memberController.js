const { User, Membership, sequelize } = require('../models');
const { hashPassword, generateToken } = require('../utils/crypto');

class MemberController {
  static async createMember(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { tenantId } = req.params;
      const { email, password, fullName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const passwordHash = await hashPassword(password);

      const user = await User.create({
        tenant_id: tenantId,
        email,
        password_hash: passwordHash,
        full_name: fullName || email,
        role: 'member'
      }, { transaction });

      await Membership.create({
        user_id: user.user_id,
        tenant_id: tenantId,
        status: 'Unpaid'
      }, { transaction });

      await transaction.commit();

      res.status(201).json({
        message: 'Member created successfully',
        member: {
          userId: user.user_id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
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
    try {
      const { tenantId, memberId } = req.params;
      const { status } = req.body;

      if (!['Active', 'Unpaid', 'Frozen'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const membership = await Membership.findOne({
        where: {
          user_id: memberId,
          tenant_id: tenantId
        }
      });

      if (!membership) {
        return res.status(404).json({ error: 'Membership not found' });
      }

      await membership.update({ status });

      res.json({
        message: 'Membership status updated successfully',
        membership: {
          membershipId: membership.membership_id,
          status: membership.status
        }
      });
    } catch (error) {
      console.error('Update member status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = MemberController;
