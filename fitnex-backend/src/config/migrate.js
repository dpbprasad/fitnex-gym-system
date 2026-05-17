const { sequelize } = require('./database');

const createTables = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Create tables in the correct order (respecting foreign key dependencies)
    await sequelize.query(`
      -- Represents a single gym/business entity
      CREATE TABLE IF NOT EXISTS tenants (
        tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await sequelize.query(`
      -- Central table for all people: owners, staff, and members
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'staff', 'member')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await sequelize.query(`
      -- Defines the membership status and validity for a member
      CREATE TABLE IF NOT EXISTS memberships (
        membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Active', 'Unpaid', 'Frozen')),
        valid_from TIMESTAMPTZ,
        valid_until TIMESTAMPTZ,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await sequelize.query(`
      -- Logs every check-in and check-out event
      CREATE TABLE IF NOT EXISTS attendance_logs (
        log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('check-in', 'check-out')),
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await sequelize.query(`
      -- Chart of Accounts for the General Ledger
      CREATE TABLE IF NOT EXISTS gl_accounts (
        account_id SERIAL PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
        account_name VARCHAR(255) NOT NULL,
        account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense')),
        normal_balance VARCHAR(10) NOT NULL CHECK (normal_balance IN ('Debit', 'Credit'))
      );
    `);

    await sequelize.query(`
      -- The core of the double-entry system. Each row is a balanced transaction.
      CREATE TABLE IF NOT EXISTS gl_transactions (
        transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
        description TEXT,
        amount NUMERIC(10, 2) NOT NULL,
        debit_account_id INTEGER REFERENCES gl_accounts(account_id),
        credit_account_id INTEGER REFERENCES gl_accounts(account_id),
        transaction_date TIMESTAMPTZ DEFAULT NOW(),
        source_reference_id UUID
      );
    `);

    await sequelize.query(`
      -- Stores records of payments made by members
      CREATE TABLE IF NOT EXISTS payments (
        payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        membership_id UUID REFERENCES memberships(membership_id),
        tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
        amount NUMERIC(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'Cash',
        processed_by_user_id UUID REFERENCES users(user_id),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('All tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

createTables();
