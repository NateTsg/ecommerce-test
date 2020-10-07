import _ from "lodash";
import { Sequelize, Model, DataTypes } from "sequelize";
import { CodeGenerator } from "../../helpers/general/Code.helper";

export class Product extends Model {
  public id!: number;

  public images!: string;

  public stock!: number;
  public price!: number;

  public created_by: string;
  public updated_by: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
   
      images: {
        type: DataTypes.STRING(200),
        allowNull: false,
        get() {
          return this.getDataValue("images")
            .split(";")
            .filter((image: string) => image.length > 0);
        },
        set(value: any) {
          this.setDataValue("images", value.join(";"));
        },
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
      modelName: "product",
      tableName: "products",
      createdAt: "created_at",
      updatedAt: "updated_at",
     
    }
  );
};
