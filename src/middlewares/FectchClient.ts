import { Client } from './../models/iam/Client.model';
import { ForbiddenError } from './../errors/Errors';
import { Request, Response } from 'express';
import ClientService from '../services/iam/Client.service';
/**
 * Fetch Client
 *
 */
export const fetchClient = () => {
    return async (request: any, response: Response, next: Function) => {
        let user: any = request.user;
       ClientService.findByUserId(user.id).then((client : Client )=>{
           request.client = client;
           next();
       }).catch((error:any)=>{
            next(new ForbiddenError());
       })
            
    };
};