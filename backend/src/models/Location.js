'use strict';

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    'Location',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
      postalCode: {
        type: DataTypes.STRING(32),
        allowNull: true,
        field: 'postal_code',
      },
    },
    {
      tableName: 'locations',
    }
  );

  Location.associate = (models) => {
    Location.hasMany(models.Company, { foreignKey: 'location_id', as: 'companies' });
    Location.hasMany(models.Lead, { foreignKey: 'location_id', as: 'leads' });
  };

  return Location;
};
