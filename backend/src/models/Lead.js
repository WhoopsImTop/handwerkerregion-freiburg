'use strict';

module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define(
    'Lead',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
        allowNull: false,
      },
      urgency: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
    },
    {
      tableName: 'leads',
    }
  );

  Lead.associate = (models) => {
    Lead.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    Lead.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location' });
    Lead.hasMany(models.LeadAssignment, { foreignKey: 'lead_id', as: 'assignments' });
    Lead.hasMany(models.Review, { foreignKey: 'lead_id', as: 'reviews' });
  };

  return Lead;
};
