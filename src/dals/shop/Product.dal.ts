import { DAL } from "../../helpers/abstracts/DAL";
import { FindOptions, IncludeOptions, Transaction } from "sequelize/types";
import { Product} from "../../helpers/database/Sequelize";

class ProductDAL implements DAL {

    /**
     * Create Product
     * 
     * @param {string}      name 
     * @param {number}      price 
     * @param {number}      stock 
     * @param {string}      images
     * @param {string}      created_by
     * @param {Transaction} transaction 
     */
    static create(name: string, price: number, stock: number, images: string[], created_by: string, transaction?: Transaction): Promise<Product> {
        return new Promise((resolve, reject) => {
            Product.create({ 
                name: name,
                images: images,
                created_by: created_by,
                updated_by: created_by,
                price:price, 
                stock:stock,
            }, { transaction: transaction })
                .then((result: Product) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Products
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            Product.findAll({ where: query, include: includes, order: order })
                .then((result: Product[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Products
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any, page: number = 1, limit: number = 25): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            Product.findAll({ where: query, include: includes, limit: limit, offset: (page - 1) * limit, order: order})
                .then((result: Product[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find One Product
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<Product> {
        return new Promise((resolve, reject) => {
            Product.findOne({ where: query, include: includes, order: order })
                .then((result: Product) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count Products
     * 
     * @param query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {       
            Product.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update Product
     * 
     * @param {Product}     product
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(product: Product, payload: any, transaction?: Transaction): Promise<Product> {
        return new Promise(async (resolve, reject) => {
            if (product) {
                product.images = payload.images != null ? payload.images : product.images;
                product.stock = payload.stock != null ? payload.stock : product.stock;
                product.price = payload.price != null ? payload.price : product.price;
                try {
                    await product.save({ transaction: transaction });
                    resolve(product);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                resolve(null);
            }
        });
    }
}

export default ProductDAL;