const { query } = require('../config/database');

async function listSamples({ status, priority, search, limit = 50, offset = 0 }) {
  let sql = 'SELECT * FROM samples WHERE 1=1';
  const params = [];
  let idx = 1;

  if (status) {
    sql += ` AND status = $${idx++}`;
    params.push(status);
  }
  if (priority) {
    sql += ` AND priority = $${idx++}`;
    params.push(priority);
  }
  if (search) {
    sql += ` AND (sample_id ILIKE $${idx} OR type ILIKE $${idx} OR source ILIKE $${idx} OR description ILIKE $${idx})`;
    params.push(`%${search}%`);
    idx++;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
}

async function getSample(id) {
  const result = await query('SELECT * FROM samples WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function createSample(data) {
  const result = await query(
    `INSERT INTO samples (sample_id, type, source, description, status, priority, metadata, registered_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.sampleId,
      data.type,
      data.source,
      data.description,
      data.status || 'registered',
      data.priority || 'normal',
      JSON.stringify(data.metadata || {}),
      data.registeredBy,
    ]
  );
  return result.rows[0];
}

async function updateSample(id, data) {
  const fields = [];
  const params = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    const column = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${column} = $${idx++}`);
    params.push(key === 'metadata' ? JSON.stringify(value) : value);
  }

  if (fields.length === 0) return getSample(id);

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const result = await query(
    `UPDATE samples SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

async function deleteSample(id) {
  const result = await query('DELETE FROM samples WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

module.exports = { listSamples, getSample, createSample, updateSample, deleteSample };
