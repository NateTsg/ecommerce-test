import bcrypt from 'bcrypt';
import config from 'config';
import jsonwebtoken from 'jsonwebtoken';

import { User } from '../database/Sequelize';

/**
 * Hash Password
 * 
 * @param {string} password
 * @param {string} saltRound
 */
export const hash = (password: string, saltRound: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRound, (error, hash) => {
            if (error) {
                reject(error.message);
            }
            else {
                resolve(hash);
            }
        });
    });
};

/**
 * Compare Password
 * 
 * @param {string} candidatePassword
 * @param {string} password
 */
export const comparePassword = (candidatePassword: string, password: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (error, isMatch) => {
            if (error) {
                reject(error.message);
            }
            else {
                resolve(isMatch);
            }
        });
    });
};

/**
 * Generate JWT Access Token
 * 
 * @param {User}   user
 */
export const generateAccessToken = (user: User) => {
    return jsonwebtoken.sign({
        _id: user.id,
        username: user.username,
    }, config.get("security.jwt.secret"), { 
        expiresIn: config.get("security.jwt.expires")
    });    
};