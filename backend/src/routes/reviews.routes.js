'use strict';

const { Router } = require('express');
const reviewController = require('../controllers/reviewController');

const router = Router();

router.post('/', reviewController.create);

module.exports = router;
