import { Client } from './../../models/iam/Client.model';
import { CartStatus } from './../../helpers/constants/Status.constants';
import config from 'config';
import { Op } from 'sequelize';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import { CartItem, User } from "../../helpers/database/Sequelize";
import CartItemService from '../../services/shop/CartItem.service';
import { IPaginationResponse } from '../../helpers/adapters/Pagination';
import { Error, BadRequestError, NotFoundError } from '../../errors/Errors';

class CartItemController {
    
    /**
     * Create CartItem
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static async create(request: any, response: Response, next: Function) {
        /**
         * Validate CartItem
         */
        const Schema = new evalidate.schema({
            quantity: evalidate.number().required(Messages.CARTITEM_QUANTITY_REQUIRED),
            product_id: evalidate.number().required(Messages.CARTITEM_PRODUCT_REQUIRED), 
        });
        let result = Schema.validate(request.body);
        if (!result.isValid) {
            let error = new BadRequestError(result.errors);
            next(error);
            return;
        }
        let user_code: string = (<User> request.user).user_code;
        let client_id:number = (<Client>request.client).id;
   
        CartItemService.create(null,client_id, request.body.product_id, request.body.quantity, CartStatus.ACTIVE,  user_code)
            .then((result: CartItem) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }
 
    /**
     * Search CartItems
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static search(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.product_id) {
            queries = [ ...queries, { product_id: request.body.payload.product_id } ];
        }
        if (request.body.payload?.client_id) {
            queries = [ ...queries, { client_id: request.body.payload.client_id } ];
        }
       
        let query: any = { [Op.and]: [ queries ] };
        CartItemService.findMany(query)
            .then((result: CartItem[]) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Search CartItems (Pagination)
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static searchPaginate(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { name: { [Op.like]: `%${request.body.payload?.query}%` } } ];
        }
        let query: any = { [Op.and]: [ queries ] };
        let page = request.body.metadata?.page ? request.body.metadata?.page : 1;
        let limit = request.body.metadata?.limit ? request.body.metadata?.limit : 25;
        CartItemService.findManyPaginate(query, page, limit)
            .then((result: IPaginationResponse) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }
    /**
     * Find CartItem By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static getUserCart(request: any, response: Response, next: Function) {
        let client_id:number = (<Client>request.client).id;
        CartItemService.findMany({client_id:client_id, order_status : CartStatus.ACTIVE})
            .then((result: CartItem[]) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.CARTITEM_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }
    /**
     * Find CartItem By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findById(request: Request, response: Response, next: Function) {
        CartItemService.findById(request.params.id)
            .then((result: CartItem) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.CARTITEM_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }
   

    /**
     * Update CartItem
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response, next: Function) {
        CartItemService.update(request.params.id, request.body)
            .then((result: CartItem) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }
};

export default CartItemController;