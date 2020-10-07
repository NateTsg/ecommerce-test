import async from 'async';

import UserService from '../../services/iam/User.service';
import { User} from '../database/Sequelize';
import { Error, InternalServerError } from '../../errors/Errors';

/**
 * Initialze a Super Admin
 */
export const initializeSuperAdmin = async () => {
    return new Promise((resolve, reject) => {
        resolve()
    })
    
};