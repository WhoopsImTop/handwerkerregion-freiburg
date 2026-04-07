'use strict';

const { Category, Company } = require('../models');
const { isUuid } = require('../utils/isUuid');

async function create(req, res, next) {
  try {
    const { name, slug, seoTitle, seoDescription } = req.body;
    if (!name || !slug || !seoTitle || seoDescription === undefined) {
      return res.status(400).json({ error: 'name, slug, seoTitle, seoDescription required' });
    }
    const cat = await Category.create({
      name,
      slug,
      seoTitle,
      seoDescription,
    });
    res.status(201).json(cat);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    const { name, slug, seoTitle, seoDescription } = req.body;
    await cat.update({
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
    });
    res.json(cat);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id' });
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    const count = await Company.count({ where: { categoryId: id } });
    if (count > 0) {
      return res.status(409).json({ error: 'Kategorie ist noch Unternehmen zugeordnet' });
    }
    await cat.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, update, remove };
