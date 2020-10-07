import { Op } from 'sequelize';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import ClientService from '../../services/iam/Client.service';
import { IPaginationResponse } from '../../helpers/adapters/Pagination';
import { formatPhoneNumber } from './../../helpers/general/Phone.helpers';
import { Error, BadRequestError, NotFoundError } from '../../errors/Errors';
import { User, Client } from "../../helpers/database/Sequelize";

class ClientController {
    
    /**
     * Create Client
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            password: evalidate.string().required(Messages.USER_PASSWORD_REQUIRED),
            phone_number: evalidate.string().required(Messages.CLIENT_PHONE_REQUIRED),
            first_name: evalidate.string().required(Messages.CLIENT_FIRST_NAME_REQUIRED),
            last_name: evalidate.string().required(Messages.CLIENT_MIDDLE_NAME_REQUIRED),
            middle_name: evalidate.string().required(Messages.CLIENT_LAST_NAME_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
          
            let phone_number = formatPhoneNumber(request.body.phone_number);
            ClientService.create(request.body.first_name, request.body.middle_name, request.body.last_name, phone_number, request.body.email, request.body.password )
                .then((result: Client) => {
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
     * Search Clients
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static search(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { name: { [Op.like]: `%${request.body.payload?.query}%` } } ];
        }
        let query = { [Op.and]: [ queries ] };
        ClientService.findMany(query)
            .then((result: Client[]) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Search Clients
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static searchPaginate(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { name: { [Op.like]: `%${request.body.payload?.query}%` } } ];
        }
        let query = { [Op.and]: [ queries ] };

        let page = request.body.metadata?.page ? request.body.metadata?.page : 1;
        let limit = request.body.metadata?.limit ? request.body.metadata?.limit : 25;
        ClientService.findManyPaginate(query, page, limit)
            .then((result: IPaginationResponse) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Find Client By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findById(request: Request, response: Response, next: Function) {
        ClientService.findById(request.params.id)
            .then((result: Client) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.CLIENT_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Find Client By User Code
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByUserId(request: Request, response: Response, next: Function) {
        ClientService.findByUserId(parseInt(request.params.user_id))
            .then((result: Client) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.CLIENT_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Update Client
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response, next: Function) {
        ClientService.update(request.params.id, request.body)
            .then((result: Client) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }
};

export default ClientController;