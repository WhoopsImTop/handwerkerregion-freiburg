'use strict';

module.exports = (sequelize, DataTypes) => {
  const LeadAssignment = sequelize.define(
    'LeadAssignment',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      leadId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'lead_id',
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'company_id',
      },
      status: {
        type: DataTypes.ENUM('sent', 'opened', 'responded'),
        allowNull: false,
        defaultValue: 'sent',
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'sent_at',
      },
    },
    {
      tableName: 'lead_assignments',
    }
  );

  LeadAssignment.associate = (models) => {
    LeadAssignment.belongsTo(models.Lead, { foreignKey: 'lead_id', as: 'lead' });
    LeadAssignment.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  };

  return LeadAssignment;
};
