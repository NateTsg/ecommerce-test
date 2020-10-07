import { DAL } from "../../helpers/abstracts/DAL";
import { IncludeOptions, Transaction } from "sequelize/types";
import { User,  } from "../../helpers/database/Sequelize";

class UserDAL implements DAL {

    /**
     * Create User
     * 
     * @param {string}      username 
     * @param {string}      password 
     * @param {number}      user_type 
     * @param {string}      profile_picture 
     * @param {string}      created_by 
     * @param {Transaction} transaction 
     */
    static create(username: string, password: string, user_type: string, transaction?: Transaction): Promise<User> {
        return new Promise((resolve, reject) => {
            User.create({ 
                username: username,
                password: password,
                user_type: user_type,
            }, { transaction: transaction })
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Users
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any): Promise<User[]> {
        return new Promise((resolve, reject) => {
            User.findAll({ where: query, include: includes, order: order })
                .then((result: User[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Users
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any, page: number = 1, limit: number = 25): Promise<User[]> {
        return new Promise((resolve, reject) => {
            User.findAll({ where: query, limit: limit, offset: (page - 1) * limit, include: includes, order: order })
                .then((result: User[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find One User
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<User> {
        return new Promise((resolve, reject) => {
            User.findOne({ where: query, include: includes, order: order })
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count Users
     * 
     * @param query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            User.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update User
     * 
     * @param {User}        user
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(user: User, payload: any, transaction?: Transaction): Promise<User> {
        return new Promise(async (resolve, reject) => {
            if (user) {
                user.username = payload.username != null ? payload.username : user.username;
                user.password = payload.password != null ? payload.password : user.password;
                user.is_active = payload.is_active != null ? payload.is_active : user.is_active;
                user.is_locked = payload.is_locked != null ? payload.is_locked : user.is_locked;
               

                try {
                    await user.save({ transaction: transaction });
                    resolve(user);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                resolve(null);
            }
        });
    }
}

export default UserDAL;