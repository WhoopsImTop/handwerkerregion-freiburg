'use strict';

const { uuidDefault, dropPgEnum } = require('./utils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: uuidDefault(queryInterface.sequelize, Sequelize),
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('handwerker', 'admin'),
        allowNull: false,
        defaultValue: 'handwerker',
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
    await queryInterface.addIndex('users', ['email'], { name: 'users_email_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
    await dropPgEnum(queryInterface, 'enum_users_role');
  },
};
