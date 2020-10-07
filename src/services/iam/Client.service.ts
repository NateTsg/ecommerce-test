import { UserTypes } from './../../helpers/constants/User.constants';
import _ from 'lodash';
import async from "async";
import config from 'config';


import UserService from "./User.service";
import Messages from "../../errors/Messages";
import { User } from './../../models/iam/User.model';
import ClientDAL from "../../dals/iam/Client.dal";
import { IPaginationResponse } from "../../helpers/adapters/Pagination";
import { sequelize,  Client } from "../../helpers/database/Sequelize";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";


class ClientService {
    

    /**
     * Create Client
     * 
     * @param {string}      first_name 
     * @param {string}      middle_name 
     * @param {string}      last_name 
     * @param {string}      phone_number 
     * @param {string}      email 
     * @param {number}      password 

     */
    static create(first_name: string, middle_name: string, last_name: string, phone_number: string, email: string, password: string): Promise<Client> {
        return new Promise(async (resolve, reject) => {
            let transaction = await sequelize.transaction();
        
            async.waterfall([
                (done: Function) => {
                    UserService.create(phone_number, password, UserTypes.CLIENT, transaction)
                        .then((result: User) => {
                            done(null, result);
                        })
                        .catch((error: Error) => {
                            console.log(error);
                            done(error);
                        });
                },
                (user: User, done: Function) => {
                    
                    ClientDAL.create(user.id, first_name, middle_name, last_name,  phone_number, email, transaction)
                        .then(async (result: Client) => {
                            console.log(result)
                            await transaction.commit();
                            resolve(result);
                        })
                        .catch((error: any) => console.log(new BadRequestError(error)));
                }
            ], async (error: Error) => {
                if (error) {
                    await transaction.rollback();
                    reject(error);
                }
            });
        });
    }

    /**
     * Find Many Clients
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<Client[]> {
        return new Promise((resolve, reject) => {
            ClientDAL.findMany(query, [], [ User ])
                .then((result: Client[]) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Many Clients
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ClientDAL.count(query)
                        .then((count : any) => {
                            done(null, count);
                        })
                        .catch((error : any) => {
                            done(new InternalServerError(error));
                        });
                },
                (count: number, done: Function) => {
                    ClientDAL.findManyPaginate(query, [], [ User ], page, limit)
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
                        .catch((error : any) => {
                            done(new InternalServerError(error));
                        });
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Find One Client
     * 
     * @param {any} query
     */
    static findOne(query: any): Promise<Client> {
        return new Promise((resolve, reject) => {
            ClientDAL.findOne(query, [], [ User ])
                .then((result: Client) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Client By Id
     * 
     * @param {string} id
     */
    static findById(id: string): Promise<Client> {
        return new Promise((resolve, reject) => {
            ClientDAL.findOne({ id: id }, [], [ User ])
                .then((result: Client) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Client By User Id
     * 
     * @param {number} user_id
     */
    static findByUserId(user_id: number): Promise<Client> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ id: user_id })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.CLIENT_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    ClientService.findOne({ user_id: user.id })
                        .then((result: Client) => {
                            resolve(result);
                        })
                        .catch((error: any) => done(error));
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Update Client
     * 
     * @param id 
     * @param payload 
     */
    static update(id: string, payload: any): Promise<Client> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ClientService.findById(id)
                        .then((result: Client) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.CLIENT_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (Client: Client, done: Function) => {
                    ClientDAL.update(Client, payload)
                        .then((result: Client) => resolve(result))
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

export default ClientService;