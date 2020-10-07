import config from "config";
import { Sequelize } from "sequelize";
import logger from "../logger/Winston";

// IAM Module
import UserFactory, { User } from "../../models/iam/User.model";
import ClientFactory, { Client } from "./../../models/iam/Client.model";

//Shop Module
import ProductFactory, { Product } from "../../models/shop/Product.model";
import CartItemFactory, { CartItem } from "../../models/shop/CartItem.model";
import TransactionFactory, {
  TransactionModel,
} from "../../models/shop/Transaction.model";
let sequelize: Sequelize;

/**
 * IAM Module Initialization
 *
 * @param {Sequelize}   sequelize
 * @param {string}      onDelete
 */
const IAMModuleInitalization = (sequelize: Sequelize, onDelete: string) => {
  UserFactory(sequelize);
  ClientFactory(sequelize);
};

/**
 * FarmInput Module Initialization
 *
 * @param {Sequelize}   sequelize
 * @param {string}      onDelete
 */
const ShopModuleInitalization = (sequelize: Sequelize, onDelete: string) => {
  ProductFactory(sequelize);
  CartItemFactory(sequelize);
  TransactionFactory(sequelize);
};

/**
 * IAM Module Relationship Initialization
 *
 * @param {Sequelize}   sequelize
 * @param {string}      onDelete
 */
const IAMModuleRelationshipInitialization = (
  sequelize: Sequelize,
  onDelete: string
) => {
  User.hasMany(Client, { foreignKey: "user_id", onDelete: onDelete });
  Client.belongsTo(User, { foreignKey: "user_id", onDelete: onDelete });
};

/**
 * IAM Module Relationship Initialization
 *
 * @param {Sequelize}   sequelize
 * @param {string}      onDelete
 */
const ShopModuleRelationshipInitialization = (
  sequelize: Sequelize,
  onDelete: string
) => {
  //Client with CartItem
  Client.hasMany(CartItem, { foreignKey: "client_id", onDelete: onDelete });
  CartItem.belongsTo(Client, { foreignKey: "client_id", onDelete: onDelete });


    //Product with CartItem
    Product.hasMany(CartItem, { foreignKey: "product_id", onDelete: onDelete });
    CartItem.belongsTo(Product, { foreignKey: "product_id", onDelete: onDelete });
  
  // Transaction and Order
  TransactionModel.hasMany(CartItem, {
    foreignKey: {name:"transaction_id", allowNull: true},
  });
  CartItem.belongsTo(TransactionModel, {
    foreignKey: {name:"transaction_id", allowNull: true},
  });

  //Client With Transaction
  Client.hasMany(TransactionModel, {
    foreignKey: "client_id",
    onDelete: onDelete,
  });
  TransactionModel.belongsTo(Client, {
    foreignKey: "client_id",
    onDelete: onDelete,
  });
};

export default async () => {
  let dbHost: string = config.get("database.host");
  let dbName: string = config.get("database.name");
  let dbUser: string = config.get("database.user");
  let dbLogging: boolean = config.get("database.logging");
  let dbPassword: string = config.get("database.password");
  let dbPort: number = parseInt(config.get("database.port"));

  const ON_DELETE = process.env.NODE_ENV === "test" ? "CASCADE" : "RESTRICT";

  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: dbLogging,
  });

  IAMModuleInitalization(sequelize, ON_DELETE);
  ShopModuleInitalization(sequelize, ON_DELETE);

  IAMModuleRelationshipInitialization(sequelize, ON_DELETE);
  ShopModuleRelationshipInitialization(sequelize, ON_DELETE);

  sequelize
    .sync({ force: false })
    .then(() => {
      logger.info("Connection has been established successfully.");
    })
    .catch((error: any) => {
      logger.error(`Database connection error: ${error}`);
    });
};

export {
  sequelize,
  Sequelize,
  // IAM Module
  User,
  Client,

  //Shop Module
  CartItem,
  Product,
  TransactionModel
};
