const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/billingController');
const { isAuthenticated, isStaffOrOwner, validateTenantAccess } = require('../middleware/auth');

router.post(
  '/tenants/:tenantId/payments',
  isAuthenticated,
  isStaffOrOwner,
  validateTenantAccess,
  BillingController.createPayment
);

module.exports = router;
