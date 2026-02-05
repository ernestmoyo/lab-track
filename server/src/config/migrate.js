require('dotenv').config();
const { pool } = require('./database');

const migrations = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'technician'
      CHECK (role IN ('admin', 'lab_manager', 'technician', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Samples table
  `CREATE TABLE IF NOT EXISTS samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL,
    source VARCHAR(255),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'registered'
      CHECK (status IN ('registered', 'in_testing', 'completed', 'rejected', 'disposed')),
    priority VARCHAR(20) DEFAULT 'normal'
      CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    metadata JSONB DEFAULT '{}',
    received_at TIMESTAMPTZ DEFAULT NOW(),
    registered_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Tests table
  `CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID REFERENCES samples(id) ON DELETE CASCADE,
    test_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
    result JSONB,
    notes TEXT,
    assigned_to UUID REFERENCES users(id),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Audit log table
  `CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_samples_status ON samples(status)`,
  `CREATE INDEX IF NOT EXISTS idx_samples_sample_id ON samples(sample_id)`,
  `CREATE INDEX IF NOT EXISTS idx_tests_sample_id ON tests(sample_id)`,
  `CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id)`,
];

async function migrate() {
  console.log('Running database migrations...');
  for (const sql of migrations) {
    await pool.query(sql);
  }
  console.log('Migrations completed successfully.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
