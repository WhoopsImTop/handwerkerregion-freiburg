'use strict';

const { jsonBinary, dropPgEnum } = require('./utils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'is_blocked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('companies', 'is_blocked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('companies', 'source', {
      type: Sequelize.ENUM('manual', 'crawler'),
      allowNull: false,
      defaultValue: 'manual',
    });

    await queryInterface.addColumn('companies', 'crawler_status', {
      type: Sequelize.ENUM('none', 'pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'none',
    });

    await queryInterface.addColumn('companies', 'crawler_raw', {
      type: jsonBinary(queryInterface.sequelize, Sequelize),
      allowNull: true,
    });

    await queryInterface.addIndex('companies', ['crawler_status', 'source'], {
      name: 'companies_crawler_idx',
    });
    await queryInterface.addIndex('users', ['is_blocked'], { name: 'users_is_blocked_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('companies', 'companies_crawler_idx');
    await queryInterface.removeIndex('users', 'users_is_blocked_idx');
    await queryInterface.removeColumn('companies', 'crawler_raw');
    await queryInterface.removeColumn('companies', 'crawler_status');
    await queryInterface.removeColumn('companies', 'source');
    await queryInterface.removeColumn('companies', 'is_blocked');
    await queryInterface.removeColumn('users', 'is_blocked');
    await dropPgEnum(queryInterface, 'enum_companies_source');
    await dropPgEnum(queryInterface, 'enum_companies_crawler_status');
  },
};
