require('dotenv').config();
const { sequelize } = require('./database');
const bcrypt = require('bcryptjs');
const { Tenant, User, Membership, GLAccount } = require('../models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Create a test tenant
    const tenant = await Tenant.create({
      name: 'FitGym Test Location'
    });
    console.log('Tenant created:', tenant.tenant_id);

    // Create owner user
    const ownerPassword = await bcrypt.hash('owner123', 10);
    const owner = await User.create({
      tenant_id: tenant.tenant_id,
      email: 'owner@fitgym.com',
      password_hash: ownerPassword,
      full_name: 'Gym Owner',
      role: 'owner'
    });
    console.log('Owner user created:', owner.user_id);

    // Create staff user
    const staffPassword = await bcrypt.hash('staff123', 10);
    const staff = await User.create({
      tenant_id: tenant.tenant_id,
      email: 'staff@fitgym.com',
      password_hash: staffPassword,
      full_name: 'Gym Staff',
      role: 'staff'
    });
    console.log('Staff user created:', staff.user_id);

    // Create member user
    const memberPassword = await bcrypt.hash('member123', 10);
    const member = await User.create({
      tenant_id: tenant.tenant_id,
      email: 'member@fitgym.com',
      password_hash: memberPassword,
      full_name: 'John Doe',
      role: 'member'
    });
    console.log('Member user created:', member.user_id);

    // Create membership for the member
    const membership = await Membership.create({
      user_id: member.user_id,
      tenant_id: tenant.tenant_id,
      status: 'Unpaid',
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    console.log('Membership created:', membership.membership_id);

    // Create GL accounts for double-entry bookkeeping
    const accounts = [
      { tenant_id: tenant.tenant_id, account_name: 'Cash-on-Hand', account_type: 'Asset', normal_balance: 'Debit' },
      { tenant_id: tenant.tenant_id, account_name: 'Bank Account', account_type: 'Asset', normal_balance: 'Debit' },
      { tenant_id: tenant.tenant_id, account_name: 'Subscription Revenue', account_type: 'Revenue', normal_balance: 'Credit' },
      { tenant_id: tenant.tenant_id, account_name: 'Accounts Receivable', account_type: 'Asset', normal_balance: 'Debit' },
      { tenant_id: tenant.tenant_id, account_name: 'Unearned Revenue', account_type: 'Liability', normal_balance: 'Credit' }
    ];

    for (const account of accounts) {
      await GLAccount.create(account);
    }
    console.log('GL accounts created');

    console.log('\n=== Seed Data Summary ===');
    console.log('Tenant ID:', tenant.tenant_id);
    console.log('Owner login: owner@fitgym.com / owner123');
    console.log('Staff login: staff@fitgym.com / staff123');
    console.log('Member login: member@fitgym.com / member123');
    console.log('========================\n');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
