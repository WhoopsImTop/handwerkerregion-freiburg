'use strict';

const { User, Company, Category, Location, Lead, LeadAssignment } = require('../models');

async function me(req, res) {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

async function stats(req, res, next) {
  try {
    const [
      users,
      companies,
      categories,
      locations,
      leads,
      assignments,
      crawlerPending,
      blockedCompanies,
    ] = await Promise.all([
      User.count(),
      Company.count(),
      Category.count(),
      Location.count(),
      Lead.count(),
      LeadAssignment.count(),
      Company.count({
        where: { source: 'crawler', crawlerStatus: 'pending' },
      }),
      Company.count({ where: { isBlocked: true } }),
    ]);
    res.json({
      users,
      companies,
      categories,
      locations,
      leads,
      leadAssignments: assignments,
      crawlerPending,
      blockedCompanies,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { me, stats };
