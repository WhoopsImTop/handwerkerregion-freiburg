'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
      },
      role: {
        type: DataTypes.ENUM('handwerker', 'admin'),
        allowNull: false,
        defaultValue: 'handwerker',
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_blocked',
      },
    },
    {
      tableName: 'users',
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Company, { foreignKey: 'user_id', as: 'companies' });
  };

  return User;
};
