import config from 'config';
import { Op } from 'sequelize';
import JwtStrategy from 'passport-jwt';
import LocalStrategy from 'passport-local';

import { comparePassword } from './Security';
import Messages from '../../errors/Messages';
import { User } from '../database/Sequelize';
import UserService from '../../services/iam/User.service';


/**
 * Passport Local Strategy
 * 
 * @param email
 * @param password
 */
export const PassportLocalStrategy = new LocalStrategy.Strategy(
    { usernameField: "username", passwordField: "password" }, 
    (username, password, done) => {    
        UserService.findUserWithPermissions({ username: username })
            .then((user: User) => {
                if (user) {
                    comparePassword(password, user.password.toString())
                        .then((isMatch: boolean) => {
                            if (isMatch) {
                                return done(null, user);
                            }
                            else {
                                return done(null, false, { message: Messages.AUTHENTICATION_ERROR });
                            }
                        })
                        .catch((error) => {
                            return done(null, false, error);
                        });          
                }
                else {
                    return done(null, false, { message: Messages.AUTHENTICATION_ERROR });
                }
            })
            .catch((error: any) => {
                return done(error);
            });
});

/**
 * Passport JWT Strategy
 * 
 * @param email
 * @param password
 */
export const PassportJWTStrategy = new JwtStrategy.Strategy({ jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: config.get("security.jwt.secret") }, (payload, done) => {
    UserService.findUserWithPermissions({ id: payload._id })
        .then((user: User) => {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
        .catch(() => {
            return done(null, false);
        });
});