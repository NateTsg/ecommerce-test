import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";

export class CartItem extends Model {
  public id!: number;
  public client_id: number;
  public product_id: number;
  public transaction_id: number;

  public order_total: number;
  public order_quantity: number;
  public order_status: string;

  public created_by: string;
  public updated_by: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default (sequelize: Sequelize) => {
  CartItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      order_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
     
      order_total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      order_status: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
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
      modelName: "cart_item",
      tableName: "cart_items",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
