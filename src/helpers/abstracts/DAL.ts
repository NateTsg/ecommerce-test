import { IncludeOptions } from "sequelize/types";

export abstract class DAL {
    /**
     * Find Many
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: IncludeOptions[]): Promise<any[]> {
        return new Promise((resolve) => resolve([]));
    }

    /**
     * Find Many (Paginate)
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, order: any, includes: IncludeOptions[], page: number = 1, limit: number = 25): Promise<any[]> {
        return new Promise((resolve) => resolve([]));
    }

    /**
     * Find One
     * @param query 
     * @param order 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: IncludeOptions[]): Promise<any> {
        return new Promise((resolve) => resolve(null));
    }

    /**
     * Count
     * 
     * @param {any} query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve) => resolve(0));
    }
}