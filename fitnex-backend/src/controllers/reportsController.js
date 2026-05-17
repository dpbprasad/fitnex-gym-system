const { Membership, AttendanceLog, Payment, User } = require('../models');
const FinancialService = require('../services/FinancialService');
const { Op } = require('sequelize');

class ReportsController {
  static async getIncomeStatement(req, res) {
    try {
      const { tenantId } = req.params;
      const { from, to } = req.query;

      if (!from || !to) {
        return res.status(400).json({ error: 'From and to dates required' });
      }

      const startDate = new Date(from);
      const endDate = new Date(to);

      const incomeStatement = await FinancialService.generateIncomeStatement(
        tenantId,
        startDate,
        endDate
      );

      res.json(incomeStatement);
    } catch (error) {
      console.error('Income statement error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getARAging(req, res) {
    try {
      const { tenantId } = req.params;

      const unpaidMemberships = await Membership.findAll({
        where: {
          tenant_id: tenantId,
          status: 'Unpaid'
        },
        include: [{ model: User }],
        order: [['updated_at', 'ASC']]
      });

      const unpaidMembers = unpaidMemberships.map(membership => ({
        memberId: membership.user_id,
        fullName: membership.User.full_name,
        email: membership.User.email,
        status: membership.status,
        lastUpdated: membership.updated_at
      }));

      res.json({ unpaidMembers });
    } catch (error) {
      console.error('AR aging error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getTrafficAnalytics(req, res) {
    try {
      const { tenantId } = req.params;
      const { from, to } = req.query;

      if (!from || !to) {
        return res.status(400).json({ error: 'From and to dates required' });
      }

      const startDate = new Date(from);
      const endDate = new Date(to);

      const attendanceLogs = await AttendanceLog.findAll({
        where: {
          tenant_id: tenantId,
          timestamp: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [{ model: User }],
        order: [['timestamp', 'DESC']]
      });

      const totalCheckIns = attendanceLogs.filter(log => log.event_type === 'check-in').length;
      const totalCheckOuts = attendanceLogs.filter(log => log.event_type === 'check-out').length;

      const uniqueMembers = new Set(attendanceLogs.map(log => log.user_id)).size;

      res.json({
        totalCheckIns,
        totalCheckOuts,
        uniqueMembers,
        period: { from: startDate, to: endDate },
        logs: attendanceLogs.map(log => ({
          userId: log.user_id,
          fullName: log.User.full_name,
          eventType: log.event_type,
          timestamp: log.timestamp
        }))
      });
    } catch (error) {
      console.error('Traffic analytics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ReportsController;
