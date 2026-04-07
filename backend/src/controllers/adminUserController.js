'use strict';

const { User } = require('../models');
const { isUuid } = require('../utils/isUuid');

async function list(req, res, next) {
  try {
    const rows = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']],
      limit: Math.min(Number(req.query.limit) || 200, 500),
    });
    res.json(rows);
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
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (user.id === req.user.id && isBlocked) {
      return res.status(400).json({ error: 'Eigenes Konto kann nicht gesperrt werden' });
    }
    await user.update({ isBlocked });
    const out = user.toJSON();
    delete out.passwordHash;
    res.json(out);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, setBlocked };
