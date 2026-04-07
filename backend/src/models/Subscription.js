'use strict';

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    'Subscription',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'company_id',
      },
      plan: {
        type: DataTypes.ENUM('basic', 'pro', 'premium'),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'started_at',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expires_at',
      },
    },
    {
      tableName: 'subscriptions',
    }
  );

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  };

  return Subscription;
};
