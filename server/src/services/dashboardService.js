const { query } = require('../config/database');

async function getStats() {
  const [samples, tests, recentSamples] = await Promise.all([
    query(`
      SELECT status, COUNT(*) as count
      FROM samples
      GROUP BY status
    `),
    query(`
      SELECT status, COUNT(*) as count
      FROM tests
      GROUP BY status
    `),
    query(`
      SELECT * FROM samples
      ORDER BY created_at DESC
      LIMIT 10
    `),
  ]);

  const sampleCounts = {};
  for (const row of samples.rows) {
    sampleCounts[row.status] = parseInt(row.count, 10);
  }

  const testCounts = {};
  for (const row of tests.rows) {
    testCounts[row.status] = parseInt(row.count, 10);
  }

  return {
    samples: sampleCounts,
    tests: testCounts,
    totalSamples: Object.values(sampleCounts).reduce((a, b) => a + b, 0),
    totalTests: Object.values(testCounts).reduce((a, b) => a + b, 0),
    recentSamples: recentSamples.rows,
  };
}

module.exports = { getStats };
