'use strict';

const { Router } = require('express');
const companyController = require('../controllers/companyController');
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');
const { isUuid } = require('../utils/isUuid');

const router = Router();

function validateCompanyIdParam(req, res, next) {
  if (!isUuid(req.params.companyId)) {
    return res.status(400).json({ error: 'Invalid company id' });
  }
  next();
}

router.get('/', companyController.list);
router.get('/:companyId/reviews', validateCompanyIdParam, reviewController.listByCompany);
router.get('/:slug', companyController.getOne);
router.post('/', requireAuth, companyController.create);
router.put('/:id', requireAuth, companyController.update);

module.exports = router;
