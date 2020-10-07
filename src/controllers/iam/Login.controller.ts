import passport from 'passport';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import { generateAccessToken } from '../../helpers/security/Security';
import { Error, InternalServerError, UnauthorizedError, BadRequestError } from '../../errors/Errors';


class LoginController {
    
    /**
     * jwt Login User Authentication
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static jwtLogin(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            username: evalidate.string().required(Messages.USERNAME_REQUIRED),
            password: evalidate.string().required(Messages.PASSWORD_REQUIRED)
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            passport.authenticate('local', { session: false }, (error, user, info) => {
                if (error) {
                    let err: Error = new InternalServerError(error.message);
                    next(err)
                }
                else if (!user) {
                    let err: Error = new UnauthorizedError();
                    next(err)
                }
                else {
                    request.logIn(user, { session: false }, (error) => {
                        if (error) {
                            let err: Error = new UnauthorizedError();
                            next(err)
                        }
                        else if (!user.is_active) {
                            let err: Error = new UnauthorizedError(Messages.ACCOUNT_INACTIVE);
                            next(err)
                        }
                        else {
                            const token = generateAccessToken(user);
                            delete user.password;
                            return response.status(200).json({
                                user: user,
                                token: token,
                            });
                        }
                    });
                }
            })(request, response);
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error)
        }
    }
};

export default LoginController;