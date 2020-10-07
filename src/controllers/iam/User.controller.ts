import _ from 'lodash';
import { Op } from 'sequelize';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import UserService from '../../services/iam/User.service';
import { ImagePathResolver } from '../../helpers/upload/PathResolver';
import { IPaginationResponse } from '../../helpers/adapters/Pagination';
import { Error, BadRequestError, NotFoundError } from '../../errors/Errors';
import {  User } from "../../helpers/database/Sequelize";


class UserController {
    
    /**
     * Create User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            user_type: evalidate.string().required(Messages.USER_TYPE_REQUIRED),
            username: evalidate.string().required(Messages.USER_USERNAME_REQUIRED),
            password: evalidate.string().required(Messages.USER_PASSWORD_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let profile_picture = null;
         
            UserService.create(request.body.username, request.body.password, request.body.user_type, profile_picture)
                .then((result: User) => {
                    response.status(200).json(result);
                })
                .catch((error: Error) => {
                    next(error);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error);
        }
    }

    /**
     * Activate User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static activateAccount(request: Request, response: Response, next: Function) {
        UserService.activate(request.params.id)
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Lock User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static lockAccount(request: Request, response: Response, next: Function) {
        UserService.lock(request.params.id)
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Unlock User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static unlockAccount(request: Request, response: Response, next: Function) {
        UserService.unlock(request.params.id)
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Deactivate User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static deactivateAccount(request: Request, response: Response, next: Function) {
        UserService.deactivate(request.params.id)
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    
    /**
     * Change Password
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static changePassword(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            new_password: evalidate.string().required(Messages.NEW_PASSWORD_REQUIRED),
            current_password: evalidate.string().required(Messages.CURRENT_PASSWORD_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let user = (<User> request.user);
            UserService.changePassword(_.toString(user.id), request.body.current_password, request.body.new_password)
                .then((result: User) => {
                    response.status(200).json(result);
                })
                .catch((error: Error) => {
                    next(error);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error);
        }
    }

    /**
     * Change Profile Pciture
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static changeProfilePicture(request: Request, response: Response, next: Function) {
        let user = (<User> request.user);
        let image: string = ImagePathResolver(request.file);
        UserService.update(_.toString(user.id), { profile_picture: image })
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Change Profile Pciture
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static changeOtherUserProfilePicture(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            user_id: evalidate.string().required(Messages.USER_REQUIRED)
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let user = (<User> request.user);
            let image: string = ImagePathResolver(request.file);
            UserService.update(_.toString(request.body.user_id), { profile_picture: image })
                .then((result: User) => {
                    response.status(200).json(result);
                })
                .catch((error: Error) => {
                    next(error);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error);
        }
    }

    /**
     * Search Users
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static search(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { [Op.or]: [
                { name: { [Op.like]: `%${request.body.payload?.query}%` } },
                { email: { [Op.like]: `%${request.body.payload?.query}%` } },
                { phone_number: { [Op.like]: `%${request.body.payload?.query}%` } }
            ] } ];
        }
        let query = { [Op.and]: [ queries ] };
        UserService.findMany(query)
            .then((result: User[]) => response.json(result))
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Search Users (Paginate)
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static searchPaginate(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { [Op.or]: [
                { name: { [Op.like]: `%${request.body.payload?.query}%` } },
                { email: { [Op.like]: `%${request.body.payload?.query}%` } },
                { phone_number: { [Op.like]: `%${request.body.payload?.query}%` } }
            ] } ];
        }
        let query = { [Op.and]: [ queries ] };
        
        let page = request.body.metadata?.page ? request.body.metadata?.page : 1;
        let limit = request.body.metadata?.limit ? request.body.metadata?.limit : 25;

        UserService.findManyPaginate(query, page, limit)
            .then((result: IPaginationResponse) => response.json(result))
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Find User By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findById(request: Request, response: Response, next: Function) {
        UserService.findById(request.params.id)
            .then((result: User) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.USER_NOT_FOUND);
                    next(error);
                }
            })
            .catch((error: Error) => {
                next(error);
            });
    }

 
    /**
     * Update User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response, next: Function) {
        UserService.update(request.params.id, request.body)
            .then((result: User) => response.json(result))
            .catch((error: Error) => {
                next(error);
            });
    }
};

export default UserController;