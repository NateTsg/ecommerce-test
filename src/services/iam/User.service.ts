import _ from 'lodash';
import async from "async";
import config from 'config';


import Messages from "../../errors/Messages";
import UserDAL from "../../dals/iam/User.dal";

import ClientDAL from "../../dals/iam/Client.dal";
import { PaginationAdapter } from "../../helpers/adapters/Pagination";
import { comparePassword, hash } from "../../helpers/security/Security";
import { IPaginationResponse } from "../../helpers/adapters/Pagination";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";
import { User, Client } from "../../helpers/database/Sequelize";
import { Transaction } from 'sequelize/types';



class UserService {
    
    /**
     * Create User
     * 
     * @param {string}          username 
     * @param {string}          password 
     * @param {number}          user_type 
     * @param {string}          profile_picture 
     * @param {string}          created_by
     * @param {Transaction}     transaction 
     */
    static create(username: string, password: string, user_type: string, transaction?: Transaction): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ username: username })
                        .then((result: User) => {
                            if (result) {
                                done(new BadRequestError([
                                    { field: "username", message: Messages.USER_ALREADY_EXISTS }
                                ]));
                            }
                            else {
                                done(null);
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (done: Function) => {
                   
                    hash(password.toString(), config.get("security.hash.saltRound"))
                        .then((hash) => {
                            done(null,  hash);
                        })
                        .catch((error) => {
                            done(new BadRequestError([ error ]));
                        });
                },
                (hash: string, done: Function) => {
                    UserDAL.create(username, hash, user_type, transaction)
                        .then((result: User) => resolve(result))
                        .catch((error: any) => reject(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }


    

    /**
     * Activate User
     * 
     * @param {string} user_id 
     */
    static activate(user_id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ id: user_id })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, { is_active: true })
                        .then((result: User) => resolve(result))
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
     * Deactivate User
     * 
     * @param {string} user_id 
     */
    static deactivate(user_id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ user_id: user_id })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, { is_active: false })
                        .then((result: User) => resolve(result))
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
     * Lock User
     * 
     * @param {string} user_id 
     */
    static lock(user_id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ user_id: user_id })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, { is_locked: true })
                        .then((result: User) => resolve(result))
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
     * Unlock User
     * 
     * @param {string} user_id 
     */
    static unlock(user_id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ user_id: user_id })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, { is_locked: false })
                        .then((result: User) => resolve(result))
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
     * Change Password
     * 
     * @param {string} id 
     * @param {string} currentPassword 
     * @param {string} newPassword 
     */
    static changePassword(id: string, currentPassword: string, newPassword: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findById(id)
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    comparePassword(currentPassword, user.password)
                        .then((isMatch: boolean) => {
                            if (isMatch) {
                                done(null, user);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "current_password", message: Messages.PASSWORD_INCORRECT }
                                ]));
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(new InternalServerError(error)));
                },
                (user: User, done: Function) => {
                    hash(newPassword, config.get("security.hash.saltRound"))
                        .then((hash: string) => {
                            done(null, user, hash);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError([ error ]));
                        });
                },
                (user: User, hash: string, done: Function) => {
                    UserDAL.update(user, { password: hash })
                        .then((user: User) => {
                            resolve(user);
                        })
                        .catch((error) => {
                            done(new BadRequestError([ error ]));
                        });
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Find Many Users
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<User[]> {
        return new Promise((resolve, reject) => {
            UserDAL.findMany(query, [], [  ])
                .then((result: User[]) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Many Roles
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaginationAdapter(UserDAL, query, [], [  ], page, limit)
                .then((result: IPaginationResponse) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One User
     * 
     * @param {any} query
     */
    static findOne(query: any): Promise<User> {
        return new Promise((resolve, reject) => {
            UserDAL.findOne(query, [], [  ])
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One User
     * 
     * @param {any} query
     */
    static findUserWithPermissions(query: any): Promise<User> {
        return new Promise((resolve, reject) => {
            UserDAL.findOne(query, [], [  ])
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find User By Id
     * 
     * @param {string} id
     */
    static findById(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            UserDAL.findOne({ id: id }, [], [  ])
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find User Detail
     * 
     * @param {User}  user 
     */
    static findClient(user: User): Promise<Client > {
        return new Promise((resolve, reject) => { 
            ClientDAL.findOne({ user_id: user.id }, [], [ User ])
                .then((result: Client) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
            
        });
    }

    /**
     * Update User
     * 
     * @param id 
     * @param payload 
     */
    static update(id: string, payload: any): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findById(id)
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, payload)
                        .then((result: User) => resolve(result))
                        .catch((error: any) => done(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

};

export default UserService;