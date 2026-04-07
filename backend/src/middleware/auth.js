'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const payload = jwt.verify(token, getSecret());
    const user = await User.findByPk(payload.sub, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (payload.role && payload.role !== user.role) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next(err);
  }
}

function signToken(userId, role) {
  return jwt.sign(
    { sub: userId, role: role || 'handwerker' },
    getSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, signToken };
