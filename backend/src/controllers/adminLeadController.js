'use strict';

const { Lead, Category, Location } = require('../models');
const { isUuid } = require('../utils/isUuid');

async function list(req, res, next) {
  try {
    const rows = await Lead.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Location, as: 'location', attributes: ['id', 'name', 'slug'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: Math.min(Number(req.query.limit) || 200, 500),
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const lead = await Lead.findByPk(id);
    if (!lead) return res.status(404).json({ error: 'Not found' });
    await lead.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, remove };
