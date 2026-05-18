const { sequelize } = require('../src/config/database');

async function migrate() {
  try {
    console.log('Starting Phase 1 core features migration...');

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Add new columns to users table
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
        ADD COLUMN IF NOT EXISTS password_set BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
        ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
        ADD COLUMN IF NOT EXISTS id_type VARCHAR(20) CHECK (id_type IN ('NIC', 'Driving Licence', 'Passport')),
        ADD COLUMN IF NOT EXISTS id_number VARCHAR(50),
        ADD COLUMN IF NOT EXISTS date_of_birth DATE,
        ADD COLUMN IF NOT EXISTS age INTEGER,
        ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
        ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS height DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS permanent_address TEXT,
        ADD COLUMN IF NOT EXISTS temporary_address TEXT,
        ADD COLUMN IF NOT EXISTS contact_number VARCHAR(20),
        ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500),
        ADD COLUMN IF NOT EXISTS guardian_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS guardian_contact VARCHAR(20),
        ADD COLUMN IF NOT EXISTS guardian_signature BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS declaration_signed BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS declaration_signed_at DATE
      `, { transaction });

      // Create health_declarations table
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS health_declarations (
          declaration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          heart_condition BOOLEAN DEFAULT false,
          heart_condition_details TEXT,
          blood_pressure BOOLEAN DEFAULT false,
          blood_pressure_details TEXT,
          asthma BOOLEAN DEFAULT false,
          asthma_details TEXT,
          diabetes BOOLEAN DEFAULT false,
          diabetes_details TEXT,
          joint_injuries BOOLEAN DEFAULT false,
          joint_injuries_details TEXT,
          recent_surgery BOOLEAN DEFAULT false,
          recent_surgery_details TEXT,
          allergies BOOLEAN DEFAULT false,
          allergies_details TEXT,
          pregnancy VARCHAR(20) CHECK (pregnancy IN ('Yes', 'No', 'Prefer not to say')),
          pregnancy_details TEXT,
          created_at DATE DEFAULT CURRENT_DATE,
          updated_at DATE DEFAULT CURRENT_DATE
        )
      `, { transaction });

      // Create emergency_contacts table
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS emergency_contacts (
          contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          relationship VARCHAR(100) NOT NULL,
          contact_number VARCHAR(20) NOT NULL,
          created_at DATE DEFAULT CURRENT_DATE
        )
      `, { transaction });

      // Create membership_status_history table
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS membership_status_history (
          history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          membership_id UUID NOT NULL REFERENCES memberships(membership_id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          previous_status VARCHAR(20) CHECK (previous_status IN ('Active', 'On Hold', 'Inactive')),
          new_status VARCHAR(20) NOT NULL CHECK (new_status IN ('Active', 'On Hold', 'Inactive')),
          reason VARCHAR(50) CHECK (reason IN ('payment_delay', 'rule_violation', 'medical_leave', 'member_request', 'other')),
          reason_details TEXT,
          changed_by_user_id UUID REFERENCES users(user_id),
          changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, { transaction });

      // Drop old constraint if exists BEFORE updating data
      await sequelize.query(`
        ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_status_check
      `, { transaction });

      // Update existing membership status values to match new enum
      await sequelize.query(`
        UPDATE memberships 
        SET status = 'Inactive' 
        WHERE status NOT IN ('Active', 'On Hold', 'Inactive')
      `, { transaction });

      // Update membership status enum
      await sequelize.query(`
        ALTER TABLE memberships 
        ALTER COLUMN status TYPE VARCHAR(20) USING status::VARCHAR(20),
        ADD CONSTRAINT check_membership_status CHECK (status IN ('Active', 'On Hold', 'Inactive'))
      `, { transaction });

      // Update default status
      await sequelize.query(`
        ALTER TABLE memberships 
        ALTER COLUMN status SET DEFAULT 'Inactive'
      `, { transaction });

      // Commit transaction
      await transaction.commit();
      console.log('Migration completed successfully!');
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
