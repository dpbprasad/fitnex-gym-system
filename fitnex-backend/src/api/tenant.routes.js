const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenantController');
const { isAuthenticated, isTenantAdmin, validateTenantAccess } = require('../middleware/auth');

router.post(
  '/tenants/:tenantId/staff',
  isAuthenticated,
  isTenantAdmin,
  validateTenantAccess,
  TenantController.createStaff
);

router.get(
  '/tenants/:tenantId/staff',
  isAuthenticated,
  isTenantAdmin,
  validateTenantAccess,
  TenantController.listStaff
);

module.exports = router;
