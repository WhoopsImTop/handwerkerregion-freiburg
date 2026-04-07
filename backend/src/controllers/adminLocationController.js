'use strict';

const { Location, Company } = require('../models');
const { isUuid } = require('../utils/isUuid');

async function list(req, res, next) {
  try {
    const rows = await Location.findAll({ order: [['name', 'ASC']] });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, slug, postalCode } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'name and slug required' });
    }
    const loc = await Location.create({
      name,
      slug,
      postalCode: postalCode || null,
    });
    res.status(201).json(loc);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const loc = await Location.findByPk(id);
    if (!loc) return res.status(404).json({ error: 'Not found' });
    const { name, slug, postalCode } = req.body;
    await loc.update({
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(postalCode !== undefined && { postalCode }),
    });
    res.json(loc);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const loc = await Location.findByPk(id);
    if (!loc) return res.status(404).json({ error: 'Not found' });
    const count = await Company.count({ where: { locationId: id } });
    if (count > 0) {
      return res.status(409).json({ error: 'Standort ist noch vergeben' });
    }
    await loc.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
