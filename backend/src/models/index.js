const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const User = require('./User')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const Location = require('./Location')(sequelize, DataTypes);
const Company = require('./Company')(sequelize, DataTypes);
const Subscription = require('./Subscription')(sequelize, DataTypes);
const Lead = require('./Lead')(sequelize, DataTypes);
const LeadAssignment = require('./LeadAssignment')(sequelize, DataTypes);
const Review = require('./Review')(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  Category,
  Location,
  Company,
  Subscription,
  Lead,
  LeadAssignment,
  Review,
};

User.associate(db);
Category.associate(db);
Location.associate(db);
Company.associate(db);
Subscription.associate(db);
Lead.associate(db);
LeadAssignment.associate(db);
Review.associate(db);

module.exports = db;
