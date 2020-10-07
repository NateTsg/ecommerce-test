import { Client } from './../../models/iam/Client.model';
import  ProductService from './Product.service';
import _ from 'lodash';
import async from "async";
import { Transaction } from "sequelize/types";

import Messages from "../../errors/Messages";

import { IPaginationResponse, PaginationAdapter } from "../../helpers/adapters/Pagination";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";
import { CartItem, Product } from "../../helpers/database/Sequelize";
import CartItemDAL from '../../dals/shop/CartItem.dal';


class CartItemService {
    
    /**
     * Create CartItem
     * 
     * @param {number}      client_id 
     * @param {number}      product_id 
     * @param {number}      order_quantity 
     * @param {string}      order_status 
     * @param {string}      created_by 
     */
    static create(transaction_id: string, client_id: number,  product_id: number, order_quantity: number, order_status: string, created_by: string): Promise<CartItem> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ProductService.findById(product_id)
                        .then((productDetail: Product) => {
                            if (productDetail) {
                                if(productDetail.stock >= order_quantity){
                                    done(null, productDetail);
                                }else{
                                    done(new BadRequestError([
                                        { field: "stock", message: Messages.PRODUCT_STOCK_NOT_AVAILABLE }
                                    ]));
                                }
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "product_id", message: Messages.PRODUCT_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error:any) => done(error))
                },
                (productDetail: Product, done: Function) => {
                    CartItemDAL.findOne({client_id:client_id, product_id:product_id}, null, [Client, Product]).then((cartItem:CartItem)=>{
                        if(cartItem){
                            done(null, cartItem, productDetail);
                        }else{
                            done(null, null, productDetail);
                        }
                    }).catch((error:any)=>done(error))

                },
                (cartItem:CartItem, productDetail: Product, done: Function) => {
                    if(cartItem){
                        let quantity: number= cartItem.order_quantity + order_quantity;
                        let total: number = cartItem.order_total +  (
                            order_quantity * productDetail.price 
                        );
                        CartItemDAL.update(cartItem,{order_quantity : quantity, order_total: total}).then((result:CartItem)=> done(null,result, productDetail))
                        .catch((error:any)=>done(error))
                    }else{
                        CartItemDAL.create(_.toNumber(transaction_id), _.toNumber(client_id), productDetail.id, order_quantity,productDetail.price *  order_quantity, order_status, created_by)
                        .then((result: CartItem) => done(null,result,productDetail))
                        .catch((error: any) => done(new BadRequestError(error)));
                    }
                    
                },
                (cartDetail:CartItem, productDetail: Product, done: Function) => {
                    ProductService.update(productDetail.id, {stock : productDetail.stock - order_quantity}).then((result:Product)=> resolve(cartDetail))
                    .catch((error:any)=>done(error))
                }

            ],(error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Remove CartItem
     * 
     * @param {number}      client_id 
     * @param {number}      product_id 
     * @param {number}      order_quantity 
     * @param {string}      order_status 
     * @param {string}      created_by 
     */
    static remove( client_id: number,  product_id: number, order_quantity: number): Promise<CartItem> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ProductService.findById(product_id)
                        .then((productDetail: Product) => {
                            if (productDetail) {
                                done(null, productDetail);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "product_id", message: Messages.PRODUCT_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error:any) => done(error))
                },
                (productDetail: Product, done: Function) => {
                    CartItemDAL.findOne({client_id:client_id, product_id:product_id}, null, [Client, Product]).then((cartItem:CartItem)=>{
                        if(cartItem){
                            done(null, cartItem, productDetail);
                        }else{
                            done(null, null, productDetail);
                        }
                    }).catch((error:any)=>done(error))

                },
                (cartItem:CartItem, productDetail: Product, done: Function) => {
                    if(cartItem){
                        if(cartItem.order_quantity >= order_quantity){
                            let quantity: number= cartItem.order_quantity - order_quantity;
                            let total: number = cartItem.order_total -  (
                                order_quantity * productDetail.price 
                            );
                            CartItemDAL.update(cartItem,{order_quantity : quantity, order_total: total}).then((result:CartItem)=> done(null,result, productDetail))
                            .catch((error:any)=>done(error))
                        }else{
                            done(new BadRequestError([
                                { field: "stock", message: Messages.PRODUCT_STOCK_NOT_AVAILABLE }
                            ]));
                        }
                        
                    }else{
                        done(new NotFoundError(Messages.CARTITEM_NOT_FOUND));
                    }
                    
                },
                (cartDetail:CartItem, productDetail: Product, done: Function) => {
                    ProductService.update(productDetail.id, {stock : productDetail.stock + order_quantity}).then((result:Product)=> resolve(cartDetail))
                    .catch((error:any)=>done(error))
                }

            ],(error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }


    /**
     * Find Many CartItems
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<CartItem[]> {
        return new Promise((resolve, reject) => {
            CartItemDAL.findMany(query, [], [])
                .then((result: CartItem[]) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Many CartItems
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaginationAdapter(CartItemDAL, query, [], [], page, limit)
                .then((result: IPaginationResponse) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One CartItem
     * 
     * @param {any} query
     */
    static findOne(query: any): Promise<CartItem> {
        return new Promise((resolve, reject) => {
            CartItemDAL.findOne(query, [], [])
                .then((result: CartItem) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find CartItem By Id
     * 
     * @param {string} id
     */
    static findById(id: string): Promise<CartItem> {
        return new Promise((resolve, reject) => {
            CartItemDAL.findOne({ id: id }, [], [])
                .then((result: CartItem) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Update CartItem
     * 
     * @param {string}  id 
     * @param {any}     payload 
     */
    static update(id: string, payload: any): Promise<CartItem> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    CartItemService.findById(id)
                        .then((result: CartItem) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.CARTITEM_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (order: CartItem, done: Function) => {
                    CartItemDAL.update(order, payload)
                        .then((result: CartItem) => resolve(result))
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

export default CartItemService;