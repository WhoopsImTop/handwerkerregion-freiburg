'use strict';

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
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
      seoTitle: {
        type: DataTypes.STRING(512),
        allowNull: false,
        field: 'seo_title',
      },
      seoDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'seo_description',
      },
    },
    {
      tableName: 'categories',
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Company, { foreignKey: 'category_id', as: 'companies' });
    Category.hasMany(models.Lead, { foreignKey: 'category_id', as: 'leads' });
  };

  return Category;
};
