const { User, sequelize } = require('../models');
const { hashPassword, generateToken } = require('../utils/crypto');
const QRService = require('../services/QRService');

class TenantController {
  static async createStaff(req, res) {
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

      const staff = await User.create({
        tenant_id: tenantId,
        email,
        password_hash: passwordHash,
        full_name: fullName || email,
        role: 'staff'
      });

      res.status(201).json({
        message: 'Staff created successfully',
        staff: {
          userId: staff.user_id,
          email: staff.email,
          fullName: staff.full_name,
          role: staff.role
        }
      });
    } catch (error) {
      console.error('Create staff error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async listStaff(req, res) {
    try {
      const { tenantId } = req.params;

      const staff = await User.findAll({
        where: {
          tenant_id: tenantId,
          role: 'staff'
        },
        attributes: ['user_id', 'email', 'full_name', 'role', 'created_at']
      });

      res.json({ staff });
    } catch (error) {
      console.error('List staff error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getQRToken(req, res) {
    try {
      const { tenantId } = req.params;
      const token = QRService.generateCheckInToken(tenantId);
      res.json({ token });
    } catch (error) {
      console.error('Get QR token error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = TenantController;
