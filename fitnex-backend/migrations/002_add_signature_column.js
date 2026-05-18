const { sequelize } = require('../src/config/database');

async function migrate() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Adding signature_url column to users table...');

    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS signature_url VARCHAR(500)
    `, { transaction });

    await transaction.commit();
    console.log('Migration completed successfully!');
  } catch (error) {
    await transaction.rollback();
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
