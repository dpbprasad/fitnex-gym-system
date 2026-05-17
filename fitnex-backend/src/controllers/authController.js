const { User, Tenant, sequelize } = require('../models');
const { hashPassword, comparePassword, generateToken } = require('../utils/crypto');

class AuthController {
  static async register(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { gymName, email, password, fullName } = req.body;

      if (!gymName || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const tenant = await Tenant.create({
        name: gymName
      }, { transaction });

      const passwordHash = await hashPassword(password);

      const user = await User.create({
        tenant_id: tenant.tenant_id,
        email,
        password_hash: passwordHash,
        full_name: fullName || email,
        role: 'owner'
      }, { transaction });

      await transaction.commit();

      const token = generateToken({
        userId: user.user_id,
        tenantId: tenant.tenant_id,
        role: user.role
      });

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          userId: user.user_id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        },
        tenant: {
          tenantId: tenant.tenant_id,
          name: tenant.name
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      console.log('Login attempt for email:', email);

      const user = await User.findOne({
        where: { email },
        include: [{ model: Tenant }]
      });

      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        console.log('Invalid password for:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({
        userId: user.user_id,
        tenantId: user.tenant_id,
        role: user.role
      });

      console.log('Login successful for:', email);

      res.json({
        message: 'Login successful',
        token,
        user: {
          userId: user.user_id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        },
        tenant: {
          tenantId: user.tenant_id,
          name: user.Tenant?.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  }
}

module.exports = AuthController;
