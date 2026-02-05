const express = require('express');
const sampleService = require('../services/sampleService');
const { authenticate, authorize, auditLog } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { status, priority, search, limit, offset } = req.query;
    const samples = await sampleService.listSamples({
      status,
      priority,
      search,
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0,
    });
    res.json(samples);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const sample = await sampleService.getSample(req.params.id);
    if (!sample) return res.status(404).json({ error: 'Sample not found' });
    res.json(sample);
  } catch (err) {
    next(err);
  }
});

router.post('/', authorize('admin', 'lab_manager', 'technician'), async (req, res, next) => {
  try {
    const { sampleId, type, source, description, priority, metadata } = req.body;
    if (!sampleId || !type) {
      return res.status(400).json({ error: 'Sample ID and type are required' });
    }
    const sample = await sampleService.createSample({
      sampleId,
      type,
      source,
      description,
      priority,
      metadata,
      registeredBy: req.user.id,
    });
    await auditLog(req, 'create', 'sample', sample.id, { sampleId });
    res.status(201).json(sample);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Sample ID already exists' });
    }
    next(err);
  }
});

router.patch('/:id', authorize('admin', 'lab_manager', 'technician'), async (req, res, next) => {
  try {
    const sample = await sampleService.updateSample(req.params.id, req.body);
    if (!sample) return res.status(404).json({ error: 'Sample not found' });
    await auditLog(req, 'update', 'sample', sample.id, req.body);
    res.json(sample);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authorize('admin', 'lab_manager'), async (req, res, next) => {
  try {
    const deleted = await sampleService.deleteSample(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Sample not found' });
    await auditLog(req, 'delete', 'sample', req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
