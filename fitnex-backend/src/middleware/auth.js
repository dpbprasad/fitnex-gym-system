const jwt = require('jsonwebtoken');
const config = require('../config');

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const isTenantAdmin = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied. Owner role required.' });
  }
  next();
};

const isStaffOrOwner = (req, res, next) => {
  if (req.user.role !== 'staff' && req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied. Staff or Owner role required.' });
  }
  next();
};

const validateTenantAccess = (req, res, next) => {
  const requestedTenantId = req.params.tenantId;
  
  if (req.user.tenantId !== requestedTenantId) {
    return res.status(403).json({ error: 'Access denied. You can only access your own tenant data.' });
  }
  
  req.tenantId = requestedTenantId;
  next();
};

module.exports = {
  isAuthenticated,
  isTenantAdmin,
  isStaffOrOwner,
  validateTenantAccess
};
