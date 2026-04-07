'use strict';

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
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
      leadId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'lead_id',
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      responseSpeed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'response_speed',
      },
      friendliness: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'reviews',
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    Review.belongsTo(models.Lead, { foreignKey: 'lead_id', as: 'lead' });
  };

  return Review;
};
