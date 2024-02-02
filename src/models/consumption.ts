// Consumption.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

class Consumption extends Model {
    public id!: number;
    public userId!: number;
    public consumptionDate!: Date;
    public consumptionValue!: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Consumption.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        consumptionDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        consumptionValue: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'Consumptions',
        modelName: 'Consumption',
    }
);

export { Consumption };