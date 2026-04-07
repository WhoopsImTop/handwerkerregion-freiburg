'use strict';

const { Review, Company, Lead } = require('../models');

async function create(req, res, next) {
  try {
    const { companyId, leadId, rating, responseSpeed, friendliness, comment } =
      req.body;
    if (!companyId || rating == null || responseSpeed == null || friendliness == null) {
      return res.status(400).json({
        error: 'companyId, rating, responseSpeed and friendliness are required',
      });
    }
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(400).json({ error: 'Invalid companyId' });
    }
    if (leadId) {
      const lead = await Lead.findByPk(leadId);
      if (!lead) {
        return res.status(400).json({ error: 'Invalid leadId' });
      }
    }
    const review = await Review.create({
      companyId,
      leadId: leadId || null,
      rating,
      responseSpeed,
      friendliness,
      comment: comment || null,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

async function listByCompany(req, res, next) {
  try {
    const { companyId } = req.params;
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const rows = await Review.findAll({
      where: { companyId },
      order: [['createdAt', 'DESC']],
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, listByCompany };
