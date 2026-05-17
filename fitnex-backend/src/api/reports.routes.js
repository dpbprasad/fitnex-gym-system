const express = require('express');
const router = express.Router();
const ReportsController = require('../controllers/reportsController');
const { isAuthenticated, isTenantAdmin, validateTenantAccess } = require('../middleware/auth');

router.get(
  '/tenants/:tenantId/reports/income-statement',
  isAuthenticated,
  isTenantAdmin,
  validateTenantAccess,
  ReportsController.getIncomeStatement
);

router.get(
  '/tenants/:tenantId/reports/ar-aging',
  isAuthenticated,
  isTenantAdmin,
  validateTenantAccess,
  ReportsController.getARAging
);

router.get(
  '/tenants/:tenantId/reports/traffic',
  isAuthenticated,
  isTenantAdmin,
  validateTenantAccess,
  ReportsController.getTrafficAnalytics
);

module.exports = router;
