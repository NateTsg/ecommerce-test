import _ from 'lodash';
import { Op } from 'sequelize';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import { Product, User } from "../../helpers/database/Sequelize";
import { IPaginationResponse } from '../../helpers/adapters/Pagination';
import { Error, BadRequestError, NotFoundError } from '../../errors/Errors';
import ProductService from '../../services/shop/Product.service';

class ProductController {
    
    /**
     * Create Product
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static async create(request: Request, response: Response, next: Function) {
        /**
         * Validate Product
         */
        const Schema = new evalidate.schema({
            name: evalidate.string().required(Messages.PRODUCT_NAME_REQUIRED),
            price: evalidate.number().required(Messages.PRODUCT_PRICE_REQUIRED),
            stock: evalidate.number().required(Messages.PRODUCT_STOCK_REQUIRED),
           
        });
        let result = Schema.validate(request.body);
        if (!result.isValid) {
            let error = new BadRequestError(result.errors);
            next(error);
            return;
        }
              let user_code: string = (<User> request.user).user_code;
      
        ProductService.create(request.body.name, request.body.price, request.body.stock, request.body.images,  user_code)
            .then((result: Product) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }
 
    /**
     * Search Products
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static search(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { name: { [Op.like]: `%${request.body.payload?.query}%` } } ];
        }
        let query: any = { [Op.and]: [ queries ] };
        ProductService.findMany(query)
            .then((result: Product[]) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Search Products (Pagination)
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
        ProductService.findManyPaginate(query, page, limit)
            .then((result: IPaginationResponse) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Find Product By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findById(request: Request, response: Response, next: Function) {
        ProductService.findById(_.toInteger(request.params.id))
            .then((result: Product) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.PRODUCT_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }

    

    /**
     * Update Product
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response, next: Function) {
        ProductService.update(_.toInteger(request.params.id), request.body)
            .then((result: Product) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }
};

export default ProductController;