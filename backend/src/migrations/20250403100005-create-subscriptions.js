'use strict';

const { uuidDefault, dropPgEnum } = require('./utils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: uuidDefault(queryInterface.sequelize, Sequelize),
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      plan: {
        type: Sequelize.ENUM('basic', 'pro', 'premium'),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.addIndex('subscriptions', ['company_id'], {
      name: 'subscriptions_company_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subscriptions');
    await dropPgEnum(queryInterface, 'enum_subscriptions_plan');
  },
};
