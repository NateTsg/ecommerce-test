import _ from "lodash";
import { Sequelize, Model, DataTypes } from "sequelize";
import { TransactionStatus } from "./../../helpers/constants/Status.constants";

export class TransactionModel extends Model {
  public id!: number;
  public client_id: number;

  public transaction_total: number;
  public transaction_status: string;
  public transaction_date: string;

  public created_by: string;
  public updated_by: string;

  public setCartItems(value: any): void {}

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default (sequelize: Sequelize) => {
  TransactionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      transaction_date: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
      },
      transaction_status: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: TransactionStatus.UNPAID,
      },
      transaction_total: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },

      created_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "transaction",
      tableName: "transactions",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
