'use strict';

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {typeof import('sequelize')} Sequelize
 */
function uuidDefault(sequelize, Sequelize) {
  if (sequelize.getDialect() === 'postgres') {
    return Sequelize.literal('gen_random_uuid()');
  }
  return Sequelize.literal('(UUID())');
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {typeof import('sequelize')} Sequelize
 */
function jsonBinary(sequelize, Sequelize) {
  return sequelize.getDialect() === 'postgres' ? Sequelize.JSONB : Sequelize.JSON;
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {string} typeName
 */
async function dropPgEnum(queryInterface, typeName) {
  if (queryInterface.sequelize.getDialect() === 'postgres') {
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${typeName}";`);
  }
}

module.exports = { uuidDefault, jsonBinary, dropPgEnum };
