import { DAL } from "../../helpers/abstracts/DAL";
import { CartItem  } from "../../helpers/database/Sequelize";
import { IncludeOptions, Transaction } from "sequelize/types";

class CartItemDAL implements DAL {

    /**
     * Create CartItem
     * 
     * @param {number}      transaction_id 
     * @param {number}      client_id 
     * @param {number}      product_id 
     * @param {number}      order_quantity 
     * @param {number}      order_total 
     * @param {string}      order_status 
     * @param {string}      created_by 
     * @param {Transaction} transaction 
     */
    static create(transaction_id: number, client_id: number, product_id: number,  order_quantity: number, order_total: number, order_status: string, created_by?: string, transaction?: Transaction): Promise<CartItem> {
        transaction_id = transaction_id === 0 ? null : transaction_id;
        console.log("+++++++++++++++++++++++++++++++");
        return new Promise((resolve, reject) => {
            CartItem.create({ 
                created_by: created_by,
                updated_by: created_by,
                order_total: order_total,
                order_status: order_status,
                order_quantity: order_quantity,
                transaction_id: transaction_id,
                client_id: client_id,
                product_id: product_id,
            }, { transaction: transaction })
                .then((result: CartItem) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many CartItems
     * @param query 
     * @param cartItem 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: IncludeOptions    []): Promise<CartItem[]> {
        return new Promise((resolve, reject) => {
            CartItem.findAll({ where: query, order: order, include: includes })
                .then((result: CartItem[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many CartItems
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any, page: number = 1, limit: number = 25): Promise<CartItem[]> {
        return new Promise((resolve, reject) => {
            CartItem.findAll({ where: query, include: includes, order: order, limit: limit, offset: (page - 1) * limit })
                .then((result: CartItem[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find One CartItem
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<CartItem> {
        return new Promise((resolve, reject) => {
            CartItem.findOne({ where: query, order: order, include: includes })
                .then((result: CartItem) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find All matching any query
     * 
     * @param query 
     */
    static findByQuery(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            CartItem.findAll({
                ...query,
              })
                .then((result:any) => resolve(result))
                .catch((error: any) => reject(error))
        });
    }

    /**
     * Count CartItems
     * 
     * @param query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            CartItem.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }
    /**
     * Update CartItem
     * 
     * @param {CartItem}       cartItem
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(cartItem: CartItem, payload: any, transaction?: Transaction): Promise<CartItem> {
        return new Promise(async (resolve, reject) => {
            if (cartItem) {
                cartItem.order_total = payload.order_total != null ? payload.order_total : cartItem.order_total;
                cartItem.order_status = payload.order_status != null ? payload.order_status : cartItem.order_status;
                cartItem.order_quantity = payload.order_quantity != null ? payload.order_quantity : cartItem.order_quantity;
               
                try {
                    await cartItem.save({ transaction: transaction });
                    resolve(cartItem);
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

export default CartItemDAL;