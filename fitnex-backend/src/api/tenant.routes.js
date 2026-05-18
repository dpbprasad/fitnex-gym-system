const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenantController');
const { isAuthenticated, isTenantAdmin, validateTenantAccess } = require('../middleware/auth');

router.post(
  '/:tenantId/staff',
  isAuthenticated,
  isTenantAdmin,
  validateTenantAccess,
  TenantController.createStaff
);

router.get(
  '/:tenantId/staff',
  isAuthenticated,
  isTenantAdmin,
  validateTenantAccess,
  TenantController.listStaff
);

router.get(
  '/:tenantId/qr-token',
  TenantController.getQRToken
);

module.exports = router;
