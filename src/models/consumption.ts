import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from "./user";

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
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
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

// Define foreign key constraint with a unique name
Consumption.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });

export { Consumption };
