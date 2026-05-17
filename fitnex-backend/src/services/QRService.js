const jwt = require('jsonwebtoken');
const config = require('../config');

class QRService {
  static generateCheckInToken(tenantId) {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      tenantId,
      type: 'check-in',
      iat: now,
      exp: now + 15 // Token expires in 15 seconds
    };

    return jwt.sign(payload, config.jwt.secret);
  }

  static validateCheckInToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      
      if (decoded.type !== 'check-in') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired QR token');
    }
  }
}

module.exports = QRService;
