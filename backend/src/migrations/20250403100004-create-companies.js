'use strict';

const { uuidDefault, dropPgEnum } = require('./utils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: uuidDefault(queryInterface.sequelize, Sequelize),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      location_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'locations', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      website: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(512),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      postal_code: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      is_claimed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_premium: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      premium_plan: {
        type: Sequelize.ENUM('basic', 'pro', 'premium'),
        allowNull: true,
      },
      rating_avg: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addIndex('companies', ['slug'], { name: 'companies_slug_idx' });
    await queryInterface.addIndex('companies', ['category_id', 'city'], {
      name: 'companies_category_city_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('companies');
    await dropPgEnum(queryInterface, 'enum_companies_premium_plan');
  },
};
