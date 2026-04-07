'use strict';

const { Op } = require('sequelize');
const { Company, Category, Location, User } = require('../models');
const { isUuid } = require('../utils/isUuid');

function buildSlug(name, slug) {
  const base =
    slug ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  return base;
}

async function list(req, res, next) {
  try {
    const where = {};
    if (req.query.isBlocked !== undefined) {
      where.isBlocked = req.query.isBlocked === 'true';
    }
    if (req.query.source) where.source = req.query.source;
    if (req.query.crawlerStatus) where.crawlerStatus = req.query.crawlerStatus;
    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    const rows = await Company.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Location, as: 'location', attributes: ['id', 'name', 'slug'] },
        { model: User, as: 'user', attributes: ['id', 'email', 'role'] },
      ],
      order: [['updatedAt', 'DESC']],
      limit: Math.min(Number(req.query.limit) || 200, 500),
      offset: Number(req.query.offset) || 0,
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const company = await Company.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Location, as: 'location' },
        { model: User, as: 'user', attributes: ['id', 'email', 'role'] },
      ],
    });
    if (!company) return res.status(404).json({ error: 'Not found' });
    res.json(company);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const {
      name,
      slug,
      categoryId,
      locationId,
      description,
      email,
      phone,
      website,
      address,
      city,
      postalCode,
      userId,
      isClaimed,
      isPremium,
      premiumPlan,
      ratingAvg,
      isBlocked,
      source,
      crawlerStatus,
      crawlerRaw,
    } = req.body;
    if (!name || !categoryId || !email || !phone || !address || !city || !postalCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(400).json({ error: 'Invalid categoryId' });
    if (locationId) {
      const loc = await Location.findByPk(locationId);
      if (!loc) return res.status(400).json({ error: 'Invalid locationId' });
    }
    const baseSlug = buildSlug(name, slug);
    let finalSlug = baseSlug;
    let n = 0;
    while (await Company.findOne({ where: { slug: finalSlug } })) {
      n += 1;
      finalSlug = `${baseSlug}-${n}`;
    }
    const company = await Company.create({
      userId: userId || null,
      name,
      slug: finalSlug,
      categoryId,
      locationId: locationId || null,
      description: description ?? null,
      email,
      phone,
      website: website ?? null,
      address,
      city,
      postalCode,
      isClaimed: isClaimed ?? false,
      isPremium: isPremium ?? false,
      premiumPlan: premiumPlan ?? null,
      ratingAvg: ratingAvg ?? 0,
      isBlocked: isBlocked ?? false,
      source: source || 'manual',
      crawlerStatus: crawlerStatus || 'none',
      crawlerRaw: crawlerRaw ?? null,
    });
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ error: 'Not found' });
    const allowed = [
      'name',
      'slug',
      'categoryId',
      'locationId',
      'description',
      'email',
      'phone',
      'website',
      'address',
      'city',
      'postalCode',
      'userId',
      'isClaimed',
      'isPremium',
      'premiumPlan',
      'ratingAvg',
      'isBlocked',
      'source',
      'crawlerStatus',
      'crawlerRaw',
    ];
    const patch = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    if (patch.slug) {
      const clash = await Company.findOne({
        where: { slug: patch.slug, id: { [Op.ne]: id } },
      });
      if (clash) return res.status(409).json({ error: 'Slug already in use' });
    }
    await company.update(patch);
    res.json(company);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ error: 'Not found' });
    await company.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function setBlocked(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const { isBlocked } = req.body;
    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({ error: 'isBlocked boolean required' });
    }
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ error: 'Not found' });
    await company.update({ isBlocked });
    res.json(company);
  } catch (err) {
    next(err);
  }
}

async function setCrawlerDecision(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const { action } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'action must be approve or reject' });
    }
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ error: 'Not found' });
    if (company.source !== 'crawler') {
      return res.status(400).json({ error: 'Nur Crawler-Einträge können hier freigegeben werden' });
    }
    if (action === 'approve') {
      await company.update({ crawlerStatus: 'approved', isBlocked: false });
    } else {
      await company.update({ crawlerStatus: 'rejected', isBlocked: true });
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
  setBlocked,
  setCrawlerDecision,
};
