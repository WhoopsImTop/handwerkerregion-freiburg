'use strict';

const { Router } = require('express');
const authRoutes = require('./auth.routes');
const categoriesRoutes = require('./categories.routes');
const companiesRoutes = require('./companies.routes');
const leadsRoutes = require('./leads.routes');
const reviewsRoutes = require('./reviews.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoriesRoutes);
router.use('/companies', companiesRoutes);
router.use('/leads', leadsRoutes);
router.use('/reviews', reviewsRoutes);

module.exports = router;
