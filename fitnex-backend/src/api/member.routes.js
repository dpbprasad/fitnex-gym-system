const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');
const { isAuthenticated, isStaffOrOwner, validateTenantAccess } = require('../middleware/auth');

router.post(
  '/tenants/:tenantId/members',
  isAuthenticated,
  isStaffOrOwner,
  validateTenantAccess,
  MemberController.createMember
);

router.get(
  '/tenants/:tenantId/members',
  isAuthenticated,
  isStaffOrOwner,
  validateTenantAccess,
  MemberController.listMembers
);

router.get(
  '/tenants/:tenantId/members/:memberId',
  isAuthenticated,
  isStaffOrOwner,
  validateTenantAccess,
  MemberController.getMember
);

router.put(
  '/tenants/:tenantId/members/:memberId/status',
  isAuthenticated,
  isStaffOrOwner,
  validateTenantAccess,
  MemberController.updateMemberStatus
);

module.exports = router;
