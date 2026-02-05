const app = require('./app');
const { pool } = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`LabTrack API server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
