import { Sequelize, Model, DataTypes } from "sequelize";

export class Client extends Model {
  public id!: number;
  public user_id!: number;

  public first_name!: string;
  public middle_name!: string;
  public last_name!: string;

  public email!: string;
  public phone_number!: string;

  public created_by: string;
  public updated_by: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Client.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "client",
      tableName: "clients",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
