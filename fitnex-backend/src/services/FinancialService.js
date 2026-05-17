const { GLAccount, GLTransaction, sequelize } = require('../models');
const { Op } = require('sequelize');

class FinancialService {
  static async createGLAccount(tenantId, accountName, accountType, normalBalance) {
    return await GLAccount.create({
      tenant_id: tenantId,
      account_name: accountName,
      account_type: accountType,
      normal_balance: normalBalance
    });
  }

  static async getAccountsByTenant(tenantId) {
    return await GLAccount.findAll({
      where: { tenant_id: tenantId }
    });
  }

  static async findAccountByName(tenantId, accountName) {
    return await GLAccount.findOne({
      where: {
        tenant_id: tenantId,
        account_name: accountName
      }
    });
  }

  static async createDoubleEntryTransaction(tenantId, description, amount, debitAccountName, creditAccountName, sourceReferenceId = null) {
    const transaction = await sequelize.transaction();

    try {
      const debitAccount = await this.findAccountByName(tenantId, debitAccountName);
      const creditAccount = await this.findAccountByName(tenantId, creditAccountName);

      if (!debitAccount || !creditAccount) {
        throw new Error('One or both accounts not found');
      }

      const glTransaction = await GLTransaction.create({
        tenant_id: tenantId,
        description,
        amount,
        debit_account_id: debitAccount.account_id,
        credit_account_id: creditAccount.account_id,
        source_reference_id: sourceReferenceId
      }, { transaction });

      await transaction.commit();
      return glTransaction;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getTransactionsByTenant(tenantId, startDate = null, endDate = null) {
    const whereClause = { tenant_id: tenantId };

    if (startDate && endDate) {
      whereClause.transaction_date = {
        [Op.between]: [startDate, endDate]
      };
    }

    return await GLTransaction.findAll({
      where: whereClause,
      include: [
        { association: 'debitAccount' },
        { association: 'creditAccount' }
      ],
      order: [['transaction_date', 'DESC']]
    });
  }

  static async generateIncomeStatement(tenantId, startDate, endDate) {
    const transactions = await this.getTransactionsByTenant(tenantId, startDate, endDate);

    const revenue = transactions
      .filter(t => t.debitAccount?.account_type === 'Revenue' || t.creditAccount?.account_type === 'Revenue')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = transactions
      .filter(t => t.debitAccount?.account_type === 'Expense' || t.creditAccount?.account_type === 'Expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      revenue,
      expenses,
      netIncome: revenue - expenses,
      period: { startDate, endDate }
    };
  }
}

module.exports = FinancialService;
