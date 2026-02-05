const express = require('express');
const testService = require('../services/testService');
const { authenticate, authorize, auditLog } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { sampleId, status, assignedTo, limit, offset } = req.query;
    const tests = await testService.listTests({
      sampleId,
      status,
      assignedTo,
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0,
    });
    res.json(tests);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const test = await testService.getTest(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (err) {
    next(err);
  }
});

router.post('/', authorize('admin', 'lab_manager', 'technician'), async (req, res, next) => {
  try {
    const { sampleId, testType, assignedTo, notes } = req.body;
    if (!sampleId || !testType) {
      return res.status(400).json({ error: 'Sample ID and test type are required' });
    }
    const test = await testService.createTest({ sampleId, testType, assignedTo, notes });
    await auditLog(req, 'create', 'test', test.id, { testType });
    res.status(201).json(test);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authorize('admin', 'lab_manager', 'technician'), async (req, res, next) => {
  try {
    const test = await testService.updateTest(req.params.id, req.body);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    await auditLog(req, 'update', 'test', test.id, req.body);
    res.json(test);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
