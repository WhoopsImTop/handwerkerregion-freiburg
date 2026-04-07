'use strict';

const { Router } = require('express');
const leadController = require('../controllers/leadController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/', leadController.create);
router.get('/', requireAuth, leadController.listForDashboard);

module.exports = router;
