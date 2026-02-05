const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

async function login(email, password) {
  const result = await query(
    'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  if (!user.is_active) {
    throw Object.assign(new Error('Account is disabled'), { status: 403 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
  };
}

async function register(email, password, fullName, role = 'technician') {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, role, created_at`,
    [email, passwordHash, fullName, role]
  );
  return result.rows[0];
}

async function getProfile(userId) {
  const result = await query(
    'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

module.exports = { login, register, getProfile };
