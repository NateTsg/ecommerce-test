import async from 'async';
import { DAL } from '../abstracts/DAL';
import { InternalServerError } from '../../errors/Errors';
import { IncludeOptions } from 'sequelize/types';

export interface IPaginationResponse {
    data: any[];
    metadata: {
        pagination: {
            page: number;
            limit: number;
            numberOfPages: number;
            numberOfResults: number;
        }
    }
};

/**
 * Pagination Adapter
 * @param dal 
 * @param query 
 * @param order 
 * @param includes 
 * @param page 
 * @param limit 
 */
export const PaginationAdapter = (dal: typeof DAL, query: any, order: any, includes: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> => {
    return new Promise((resolve, reject) => {
        async.waterfall([
            (done: Function) => {
                dal.count(query)
                    .then((count) => {
                        done(null, count);
                    })
                    .catch((error) => {
                        done(new InternalServerError(error));
                    });
            },
            (count: number, done: Function) => {
                dal.findManyPaginate(query, order, includes, page, limit)
                    .then((result: any[]) => {
                        resolve({
                            data: result,
                            metadata: {
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    numberOfResults: count, 
                                    numberOfPages: Math.ceil(count / limit),
                                }
                            }
                        });
                    })
                    .catch((error) => {
                        done(new InternalServerError(error));
                    });
            }
        ], (error: any) => {
            if (error) {
                reject(error);
            }
        });
    });
};
