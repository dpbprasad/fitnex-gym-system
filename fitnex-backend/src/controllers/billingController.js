const { Payment, Membership, sequelize } = require('../models');
const FinancialService = require('../services/FinancialService');
const redis = require('redis');
const config = require('../config');

class BillingController {
  static async createPayment(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { tenantId } = req.params;
      const { memberId, amount, paymentMethod } = req.body;
      const processedByUserId = req.user.userId;

      if (!memberId || !amount) {
        return res.status(400).json({ error: 'Member ID and amount required' });
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

      const payment = await Payment.create({
        membership_id: membership.membership_id,
        tenant_id: tenantId,
        amount,
        payment_method: paymentMethod || 'Cash',
        processed_by_user_id: processedByUserId
      }, { transaction });

      await FinancialService.createDoubleEntryTransaction(
        tenantId,
        `Cash payment for membership renewal - Member ${memberId}`,
        amount,
        'Cash-on-Hand',
        'Subscription Revenue',
        payment.payment_id
      );

      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + 1);

      await membership.update({
        status: 'Active',
        valid_from: new Date(),
        valid_until: validUntil
      }, { transaction });

      await transaction.commit();

      const redisClient = redis.createClient({
        url: config.redis.url,
        socket: {
          tls: config.redis.tls
        }
      });

      await redisClient.connect();
      await redisClient.publish('payments:processed', JSON.stringify({
        paymentId: payment.payment_id,
        userId: memberId,
        tenantId
      }));
      await redisClient.quit();

      res.status(201).json({
        message: 'Payment processed successfully',
        payment: {
          paymentId: payment.payment_id,
          amount: payment.amount,
          paymentMethod: payment.payment_method
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Create payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = BillingController;
