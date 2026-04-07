'use strict';

const { Op } = require('sequelize');
const { sequelize, Company, Lead, LeadAssignment, Category } = require('../models');

const ASSIGNMENT_LIMIT = 5;

async function pickCompaniesForLead(categoryId, transaction) {
  return Company.findAll({
    where: {
      categoryId,
      isBlocked: false,
      [Op.or]: [{ source: 'manual' }, { crawlerStatus: 'approved' }],
    },
    order: [
      ['isPremium', 'DESC'],
      sequelize.literal('rating_avg DESC NULLS LAST'),
      [sequelize.random(), 'ASC'],
    ],
    limit: ASSIGNMENT_LIMIT,
    transaction,
  });
}

async function create(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { categoryId, locationId, description, urgency, name, email, phone } =
      req.body;
    if (!categoryId || !description || !name || !email) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: 'categoryId, description, name and email are required' });
    }
    const category = await Category.findByPk(categoryId, { transaction });
    if (!category) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid categoryId' });
    }
    const lead = await Lead.create(
      {
        categoryId,
        locationId: locationId || null,
        description,
        urgency: urgency || 'medium',
        name,
        email: email.toLowerCase().trim(),
        phone: phone || null,
      },
      { transaction }
    );
    const companies = await pickCompaniesForLead(categoryId, transaction);
    const now = new Date();
    const assignments = [];
    for (const c of companies) {
      assignments.push(
        await LeadAssignment.create(
          {
            leadId: lead.id,
            companyId: c.id,
            status: 'sent',
            sentAt: now,
          },
          { transaction }
        )
      );
    }
    await transaction.commit();
    res.status(201).json({
      lead,
      assignments: assignments.map((a) => ({
        id: a.id,
        companyId: a.companyId,
        status: a.status,
        sentAt: a.sentAt,
      })),
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
}

async function listForDashboard(req, res, next) {
  try {
    const userCompanyIds = await Company.findAll({
      where: { userId: req.user.id },
      attributes: ['id'],
    });
    const ids = userCompanyIds.map((c) => c.id);
    if (ids.length === 0) {
      return res.json([]);
    }
    const rows = await LeadAssignment.findAll({
      where: { companyId: ids },
      include: [
        {
          model: Lead,
          as: 'lead',
          include: [{ model: Category, as: 'category' }],
        },
        { model: Company, as: 'company' },
      ],
      order: [['sentAt', 'DESC']],
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, listForDashboard };
