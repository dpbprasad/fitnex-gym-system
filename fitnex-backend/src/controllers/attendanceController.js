const { AttendanceLog, User, Membership } = require('../models');
const QRService = require('../services/QRService');

class AttendanceController {
  static async getQRToken(req, res) {
    try {
      const { tenantId } = req.query;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID required' });
      }

      const token = QRService.generateCheckInToken(tenantId);

      res.json({ token });
    } catch (error) {
      console.error('Get QR token error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async validateQR(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token required' });
      }

      const decoded = QRService.validateCheckInToken(token);

      const membership = await Membership.findOne({
        where: {
          tenant_id: decoded.tenantId,
          status: 'Active'
        },
        include: [{ model: User }]
      });

      if (!membership) {
        return res.status(403).json({ error: 'No active membership found for this tenant' });
      }

      await AttendanceLog.create({
        user_id: membership.user_id,
        tenant_id: decoded.tenantId,
        event_type: 'check-in'
      });

      res.json({
        message: 'Check-in successful',
        user: {
          userId: membership.User.user_id,
          fullName: membership.User.full_name
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Validate QR error:', error);
      res.status(401).json({ error: error.message || 'Invalid or expired token' });
    }
  }
}

module.exports = AttendanceController;
