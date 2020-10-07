import { CartStatus, TransactionStatus } from './../../helpers/constants/Status.constants';
import { CartItem } from './../../models/shop/CartItem.model';
import _ from 'lodash';
import async from "async";

import Messages from "../../errors/Messages";
import TransactionModelDAL from "../../dals/shop/Transaction.dal";

import { IPaginationResponse, PaginationAdapter } from "../../helpers/adapters/Pagination";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";
import { TransactionModel,  } from "../../helpers/database/Sequelize";
import CartItemService from './CartItem.service';


class TransactionService {
 
    /**
     * Create Transaction
     * 
     * @param {string}       client_id  
     */
    static create(client_id: number): Promise<TransactionModel> {
        return new Promise((resolve,reject) =>{
            async.waterfall([
                (done:Function)=>{
                    CartItemService.findMany({client_id:client_id, order_status : CartStatus.ACTIVE}).then((result:CartItem[])=>{
                        done(null, result);
                    }).catch((error:any)=>done(error))
                },(cartItems:CartItem[], done:Function)=>{
                    let total = 0;
                    cartItems.forEach((cartItem:CartItem)=>{
                        total += cartItem.order_total;
                    })
                    TransactionModelDAL.create(client_id,total,TransactionStatus.PAID).then((transaction:TransactionModel)=>{
                        done(null, transaction);
                    }).catch((error:any)=>done(error))
                    
                },(transaction:TransactionModel, done:Function)=>{
                    CartItem.update(
                        {order_status: CartStatus.COMPLETED, transaction_id: transaction.id},
                        {where:{client_id:client_id, order_status : CartStatus.ACTIVE}},
                        ).then((result:any)=>{
                            resolve(transaction);
                        }).catch((error:any)=>done(error))
                }
            ],(error:any)=>{
                console.log(error);
                reject(new InternalServerError(error))
            })
            
        })
    }

    /**
     * Find Many Transactions
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<TransactionModel[]> {
        return new Promise((resolve, reject) => {
            TransactionModelDAL.findMany(query, [], [ CartItem ])
                .then((result: TransactionModel[]) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Many Transactions (Pagination)
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaginationAdapter(TransactionModelDAL, query, [], [ CartItem ], page, limit)
                .then((result: IPaginationResponse) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One Transaction
     * 
     * @param {any} query
     */
    static findOne(query: any): Promise<TransactionModel> {
        return new Promise((resolve, reject) => {
            TransactionModelDAL.findOne(query, [], [ CartItem ])
                .then((result: TransactionModel) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Transaction By Id
     * 
     * @param {number} id
     */
    static findById(id: number): Promise<TransactionModel> {
        return new Promise((resolve, reject) => {
            TransactionModelDAL.findOne({ id: id }, [], [ CartItem ])
                .then((result: TransactionModel) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }


    /**
     * Update Transaction
     * 
     * @param id 
     * @param payload 
     */
    static update(id: number, payload: any): Promise<TransactionModel> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    TransactionService.findById(id)
                        .then((result: TransactionModel) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.TRANSACTION_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (transaction: TransactionModel, done: Function) => {
                    TransactionModelDAL.update(transaction, payload)
                        .then((result: TransactionModel) => resolve(result))
                        .catch((error: any) => done(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }
};

export default TransactionService;