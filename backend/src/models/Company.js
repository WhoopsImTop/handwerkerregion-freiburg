'use strict';

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'Company',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'category_id',
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'location_id',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING(32),
        allowNull: false,
        field: 'postal_code',
      },
      isClaimed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_claimed',
      },
      isPremium: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_premium',
      },
      premiumPlan: {
        type: DataTypes.ENUM('basic', 'pro', 'premium'),
        allowNull: true,
        field: 'premium_plan',
      },
      ratingAvg: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'rating_avg',
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_blocked',
      },
      source: {
        type: DataTypes.ENUM('manual', 'crawler'),
        allowNull: false,
        defaultValue: 'manual',
      },
      crawlerStatus: {
        type: DataTypes.ENUM('none', 'pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'none',
        field: 'crawler_status',
      },
      crawlerRaw: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'crawler_raw',
      },
    },
    {
      tableName: 'companies',
    }
  );

  Company.associate = (models) => {
    Company.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Company.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    Company.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location' });
    Company.hasMany(models.LeadAssignment, { foreignKey: 'company_id', as: 'leadAssignments' });
    Company.hasMany(models.Review, { foreignKey: 'company_id', as: 'reviews' });
    Company.hasMany(models.Subscription, { foreignKey: 'company_id', as: 'subscriptions' });
  };

  return Company;
};
