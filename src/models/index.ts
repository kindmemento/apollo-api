import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from "./user";

class Index extends Model {
    public id!: number;
    public userId!: number;
    public indexDate!: Date;
    public indexValue!: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Index.init(
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
        indexDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        indexValue: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'Indexes',
        modelName: 'Index',
    }
);

// Define foreign key constraint with a unique name
Index.belongsTo(User, { foreignKey: { name: 'fk_index_user_id', allowNull: false }, onDelete: 'CASCADE' });

export { Index };
