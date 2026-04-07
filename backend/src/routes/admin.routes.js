'use strict';

const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const adminMetaController = require('../controllers/adminMetaController');
const adminCategoryController = require('../controllers/adminCategoryController');
const adminLocationController = require('../controllers/adminLocationController');
const adminCompanyController = require('../controllers/adminCompanyController');
const adminUserController = require('../controllers/adminUserController');
const adminLeadController = require('../controllers/adminLeadController');

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/me', adminMetaController.me);
router.get('/stats', adminMetaController.stats);

router.post('/categories', adminCategoryController.create);
router.put('/categories/:id', adminCategoryController.update);
router.delete('/categories/:id', adminCategoryController.remove);

router.get('/locations', adminLocationController.list);
router.post('/locations', adminLocationController.create);
router.put('/locations/:id', adminLocationController.update);
router.delete('/locations/:id', adminLocationController.remove);

router.get('/companies', adminCompanyController.list);
router.get('/companies/:id', adminCompanyController.getOne);
router.post('/companies', adminCompanyController.create);
router.put('/companies/:id', adminCompanyController.update);
router.delete('/companies/:id', adminCompanyController.remove);
router.patch('/companies/:id/block', adminCompanyController.setBlocked);
router.patch('/companies/:id/crawler', adminCompanyController.setCrawlerDecision);

router.get('/users', adminUserController.list);
router.patch('/users/:id/block', adminUserController.setBlocked);

router.get('/leads', adminLeadController.list);
router.delete('/leads/:id', adminLeadController.remove);

module.exports = router;
