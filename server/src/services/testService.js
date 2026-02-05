const { query } = require('../config/database');

async function listTests({ sampleId, status, assignedTo, limit = 50, offset = 0 }) {
  let sql = `
    SELECT t.*, s.sample_id AS sample_code, s.type AS sample_type
    FROM tests t
    JOIN samples s ON t.sample_id = s.id
    WHERE 1=1`;
  const params = [];
  let idx = 1;

  if (sampleId) {
    sql += ` AND t.sample_id = $${idx++}`;
    params.push(sampleId);
  }
  if (status) {
    sql += ` AND t.status = $${idx++}`;
    params.push(status);
  }
  if (assignedTo) {
    sql += ` AND t.assigned_to = $${idx++}`;
    params.push(assignedTo);
  }

  sql += ` ORDER BY t.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
}

async function getTest(id) {
  const result = await query(
    `SELECT t.*, s.sample_id AS sample_code, s.type AS sample_type
     FROM tests t
     JOIN samples s ON t.sample_id = s.id
     WHERE t.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function createTest(data) {
  const result = await query(
    `INSERT INTO tests (sample_id, test_type, status, assigned_to, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.sampleId, data.testType, data.status || 'pending', data.assignedTo, data.notes]
  );
  return result.rows[0];
}

async function updateTest(id, data) {
  const fields = [];
  const params = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    const column = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (key === 'result') {
      fields.push(`result = $${idx++}`);
      params.push(JSON.stringify(value));
    } else {
      fields.push(`${column} = $${idx++}`);
      params.push(value);
    }
  }

  if (fields.length === 0) return getTest(id);

  // Auto-set timestamps based on status
  if (data.status === 'in_progress') {
    fields.push(`started_at = COALESCE(started_at, NOW())`);
  }
  if (data.status === 'completed' || data.status === 'failed') {
    fields.push(`completed_at = NOW()`);
  }

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const result = await query(
    `UPDATE tests SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

module.exports = { listTests, getTest, createTest, updateTest };
