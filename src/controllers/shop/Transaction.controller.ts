import _ from "lodash";

import { Client } from './../../models/iam/Client.model';
import { CartStatus, TransactionStatus } from './../../helpers/constants/Status.constants';
import config from 'config';
import { Op } from 'sequelize';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import { TransactionModel, User } from "../../helpers/database/Sequelize";
import TransactionService from '../../services/shop/Transaction.service';
import { IPaginationResponse } from '../../helpers/adapters/Pagination';
import { Error, BadRequestError, NotFoundError } from '../../errors/Errors';

class TransactionController {
    
    /**
     * Create Transaction
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static async create(request: any, response: Response, next: Function) {
        /**
         * Validate Transaction
         */
        const Schema = new evalidate.schema({
            
          
        });
        let result = Schema.validate(request.body);
        if (!result.isValid) {
            let error = new BadRequestError(result.errors);
            next(error);
            return;
        }
       

        let client_id:number = (<Client>request.client).id;

        TransactionService.create(client_id)
            .then((result: TransactionModel) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }
 

    /**
     * Find Transaction By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static getCompletedTransactions(request: any, response: Response, next: Function) {
        let client_id:number = (<Client>request.client).id;
        let query: any = { [Op.and]: [ {client_id:client_id} ] };
        TransactionService.findMany(query)
            .then((result: TransactionModel[]) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.TRANSACTION_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }



    /**
     * Search Transactions
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
        console.log(query);
        TransactionService.findMany(query)
            .then((result: TransactionModel[]) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Search Transactions (Pagination)
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
        TransactionService.findManyPaginate(query, page, limit)
            .then((result: IPaginationResponse) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Find Transaction By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findById(request: Request, response: Response, next: Function) {
        TransactionService.findById(_.toInteger(request.params.id))
            .then((result: TransactionModel) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.TRANSACTION_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }
   

    /**
     * Update Transaction
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response, next: Function) {
        TransactionService.update(_.toInteger(request.params.id), request.body)
            .then((result: TransactionModel) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }
};

export default TransactionController;