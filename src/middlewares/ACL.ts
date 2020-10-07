import async from 'async';
import { Request, Response } from 'express';

import { ForbiddenError } from '../errors/Errors';

export type PermissionType = {
    type: string;
    resource: string;
}


/**
 * Check User Type
 * 
 * @param {number[]} userTypes
 */
export const hasUserType = (userTypes: number[]) => {
    return async (request: Request, response: Response, next: Function) => {
        let user: any = request.user;
        if (userTypes.includes(user.user_type_id)) {
            next();
        }
        else {
            next(new ForbiddenError());
        }
    };
};
