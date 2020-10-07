import async from "async";

import Messages from "../../errors/Messages";
import { Product } from "../../helpers/database/Sequelize";
import ProductDAL from "../../dals/shop/Product.dal";
import { IPaginationResponse, PaginationAdapter } from "../../helpers/adapters/Pagination";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";


class ProductService {
    
    /**
     * Create Product
     * 
     * @param {string}  name 
     * @param {number}  price 
     * @param {number}  stock
     * @param {string[]}  images
     * @param {string}  created_by 
     */
    static create(name: string, stock: number, price: number, images: string[], created_by?: string): Promise<Product> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    if (created_by) {
                        ProductDAL.findOne({ created_by: created_by, price: price, name:name }, [], [])
                            .then((result: Product) => {
                                if (result) {
                                    done(new BadRequestError([
                                        { field: "created_by", message: Messages.PRODUCT_EXISTS }
                                    ]));
                                }
                                else {
                                    done(null);
                                }
                            })
                            .catch((error: any) => done(new BadRequestError(error)));
                    }
                    else {
                        done(null);
                    }
                },
                
                (done: Function) => {
                    ProductDAL.create(name, stock, price, images, created_by)
                        .then((result: Product) => resolve(result))
                        .catch((error: any) => done(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

   
    /**
     * Find Many Categories
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            ProductDAL.findMany(query, [], [])
                .then((result: Product[]) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Many Categories
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaginationAdapter(ProductDAL, query, [], [], page, limit)
                .then((result: IPaginationResponse) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One Product
     * 
     * @param {any} query
     */
    static findOne(query: any): Promise<Product> {
        return new Promise((resolve, reject) => {
            ProductDAL.findOne(query, [], [])
                .then((result: Product) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Product By Id
     * 
     * @param {number} id
     */
    static findById(id: number): Promise<Product> {
        return new Promise((resolve, reject) => {
            ProductDAL.findOne({ id: id }, [], [])
                .then((result: Product) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Update Product
     * 
     * @param id 
     * @param payload 
     */
    static update(id: number, payload: any): Promise<Product> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ProductService.findById(id)
                        .then((result: Product) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.PRODUCT_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (category: Product, done: Function) => {
                    ProductDAL.update(category, payload)
                        .then((result: Product) => resolve(result))
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

export default ProductService;