const express = require('express');
const dashboardService = require('../services/dashboardService');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
