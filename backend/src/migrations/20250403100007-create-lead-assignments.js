'use strict';

const { uuidDefault, dropPgEnum } = require('./utils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lead_assignments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: uuidDefault(queryInterface.sequelize, Sequelize),
      },
      lead_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'leads', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('sent', 'opened', 'responded'),
        allowNull: false,
        defaultValue: 'sent',
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    await queryInterface.addIndex('lead_assignments', ['lead_id', 'company_id'], {
      unique: true,
      name: 'lead_assignments_lead_company_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('lead_assignments');
    await dropPgEnum(queryInterface, 'enum_lead_assignments_status');
  },
};
