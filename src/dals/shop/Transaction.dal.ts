import { IncludeOptions, Transaction } from "sequelize/types";

import { DAL } from "../../helpers/abstracts/DAL";
import { TransactionModel } from "../../helpers/database/Sequelize";

class TransactionModelDAL implements DAL {

    /**
     * Create Transaction
     * 
     * @param {number}      client_id 
     * @param {number}      transaction_total 
     * @param {string}      transaction_status
     * @param {Transaction} transaction 
     */
    static create(client_id: number,transaction_total: number,  transaction_status?: string,  transaction?: Transaction): Promise<TransactionModel> {
        return new Promise((resolve, reject) => {
            TransactionModel.create({ 
                client_id: client_id,
                transaction_total: transaction_total,
                transaction_status: transaction_status,
            }, { transaction: transaction })
                .then((result: TransactionModel) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Transactions
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any): Promise<TransactionModel[]> {
        return new Promise((resolve, reject) => {
            TransactionModel.findAll({ where: {}, include: includes, order: order })
                .then((result: any[]) => resolve(result))
                .catch((error: any) => {
                    reject(error)
                });
        });
    }

    /**
     * Find Many Transactions
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any, page: number = 1, limit: number = 25): Promise<TransactionModel[]> {
        return new Promise((resolve, reject) => {
            TransactionModel.findAll({ where: query, include: includes, order: order, limit: limit, offset: (page - 1) * limit })
                .then((result: TransactionModel[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find One Transaction
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<TransactionModel> {
        return new Promise((resolve, reject) => {
            TransactionModel.findOne({ where: query, include: includes, order: order })
                .then((result: TransactionModel) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count TransactionModels
     * 
     * @param query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            TransactionModel.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }
    /**
     * Update TransactionModel
     * 
     * @param {TransactionModel}        transactionModel
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(transactionModel: TransactionModel, payload: any, transaction?: Transaction): Promise<TransactionModel> {
        return new Promise(async (resolve, reject) => {
            if (transactionModel) {
               
                transactionModel.transaction_total = payload.transaction_total != null ? payload.transaction_total : transactionModel.transaction_total;

                transactionModel.transaction_status = payload.transaction_status != null ? payload.transaction_status : transactionModel.transaction_status;
                transactionModel.transaction_status = payload.transaction_status != null ? payload.transaction_status : transactionModel.transaction_status;
            
                try {
                    await transactionModel.save({ transaction: transaction });
                    resolve(transactionModel);
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

export default TransactionModelDAL;