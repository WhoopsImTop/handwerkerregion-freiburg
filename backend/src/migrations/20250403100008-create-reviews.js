'use strict';

const { uuidDefault } = require('./utils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
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
      lead_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'leads', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      response_speed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      friendliness: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('reviews', ['company_id'], { name: 'reviews_company_id_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reviews');
  },
};
