'use strict';

const { Category } = require('../models');

async function list(_req, res, next) {
  try {
    const rows = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
