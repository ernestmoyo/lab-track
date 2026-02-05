require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./database');

async function seed() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('labtrack-admin', 10);
  const techPassword = await bcrypt.hash('labtrack-tech', 10);

  // Create default users
  await pool.query(`
    INSERT INTO users (email, password_hash, full_name, role)
    VALUES
      ('admin@labtrack.local', $1, 'Lab Administrator', 'admin'),
      ('tech@labtrack.local', $2, 'Lab Technician', 'technician')
    ON CONFLICT (email) DO NOTHING
  `, [adminPassword, techPassword]);

  // Create sample data
  await pool.query(`
    INSERT INTO samples (sample_id, type, source, description, status, priority)
    VALUES
      ('SMP-2026-0001', 'Blood', 'Clinical Ward A', 'Routine blood panel', 'registered', 'normal'),
      ('SMP-2026-0002', 'Water', 'Municipal Supply', 'Monthly water quality test', 'in_testing', 'high'),
      ('SMP-2026-0003', 'Soil', 'Field Station B', 'Contamination screening', 'registered', 'urgent'),
      ('SMP-2026-0004', 'Tissue', 'Pathology Dept', 'Biopsy analysis', 'completed', 'normal'),
      ('SMP-2026-0005', 'Food', 'Inspection Site C', 'Bacterial count', 'in_testing', 'normal')
    ON CONFLICT (sample_id) DO NOTHING
  `);

  console.log('Seeding completed successfully.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
