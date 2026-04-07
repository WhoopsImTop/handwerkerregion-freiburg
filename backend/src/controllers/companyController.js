'use strict';

const { Op } = require('sequelize');
const { Company, Category, Location } = require('../models');
const { isUuid } = require('../utils/isUuid');

async function list(req, res, next) {
  try {
    const { categoryId, locationId, limit = 50, offset = 0 } = req.query;
    const where = {
      isBlocked: false,
      [Op.or]: [{ source: 'manual' }, { crawlerStatus: 'approved' }],
    };
    if (categoryId) where.categoryId = categoryId;
    if (locationId) where.locationId = locationId;
    const rows = await Company.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Location, as: 'location', attributes: ['id', 'name', 'slug'] },
      ],
      limit: Math.min(Number(limit) || 50, 100),
      offset: Number(offset) || 0,
      order: [
        ['isPremium', 'DESC'],
        ['ratingAvg', 'DESC'],
        ['name', 'ASC'],
      ],
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const param = req.params.slug;
    const where = isUuid(param) ? { id: param } : { slug: param };
    const company = await Company.findOne({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: Location, as: 'location' },
      ],
    });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const visible =
      !company.isBlocked &&
      (company.source === 'manual' || company.crawlerStatus === 'approved');
    if (!visible) {
      return res.status(404).json({ error: 'Company not found' });
    }
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
    } = req.body;
    if (!name || !categoryId || !email || !phone || !address || !city || !postalCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }
    if (locationId) {
      const loc = await Location.findByPk(locationId);
      if (!loc) {
        return res.status(400).json({ error: 'Invalid locationId' });
      }
    }
    const baseSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    let finalSlug = baseSlug;
    let n = 0;
    while (await Company.findOne({ where: { slug: finalSlug } })) {
      n += 1;
      finalSlug = `${baseSlug}-${n}`;
    }
    const company = await Company.create({
      userId: req.user.id,
      name,
      slug: finalSlug,
      categoryId,
      locationId: locationId || null,
      description: description || null,
      email,
      phone,
      website: website || null,
      address,
      city,
      postalCode,
      isClaimed: true,
      isPremium: false,
      ratingAvg: 0,
      source: 'manual',
      crawlerStatus: 'none',
      isBlocked: false,
    });
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: 'Invalid company id' });
    }
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    if (company.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
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
    ];
    const patch = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    if (patch.slug) {
      const clash = await Company.findOne({
        where: { slug: patch.slug, id: { [Op.ne]: id } },
      });
      if (clash) {
        return res.status(409).json({ error: 'Slug already in use' });
      }
    }
    await company.update(patch);
    res.json(company);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update };
