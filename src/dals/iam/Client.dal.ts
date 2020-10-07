import { IncludeOptions, Transaction } from "sequelize/types";
import { Client, User } from "../../helpers/database/Sequelize";

class ClientDAL {


    /**
     * Create User Detail
     * 
     * @param user_id 
     * @param first_name 
     * @param middle_name 
     * @param last_name 
     * @param phone_number 
     * @param email 
    
     * @param transaction 
     */
    static create(user_id: number, first_name: string, middle_name: string, last_name: string, phone_number?: string, email?: string, transaction?: Transaction): Promise<Client> {
        return new Promise((resolve, reject) => {
            Client.create({ 
                email: email, 
                user_id: user_id, 
                last_name: last_name, 
                first_name: first_name,   
                middle_name: middle_name,             
                phone_number: phone_number, 
            }, { transaction: transaction })
                .then((result: Client) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many User Details
     * 
     * @param query 
     * @param user_type 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any): Promise<Client[]> {
        return new Promise((resolve, reject) => {
            Client.findAll({ where: query, include: [ { model: User, where: {} }, ...includes ], order: order })
                .then((result: Client[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many User Details (Pagination)
     * 
     * @param query 
     * @param user_type 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any,  order: any, includes: any, page: number = 1, limit: number = 25): Promise<Client[]> {
        return new Promise((resolve, reject) => {
            Client.findAll({ where: query, include: [ { model: User, where: {} }, ...includes ], order: order, limit: limit, offset: (page - 1) * limit })
                .then((result: Client[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find One User Detail
     * 
     * @param {any}     query 
     * @param {number}  user_type 
     */
    static findOne(query: any, order: any, includes: any): Promise<Client> {
        return new Promise((resolve, reject) => {
            Client.findOne({ where: query, include: [ User, ...includes ], order: order })
                .then((result: Client) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count User Details
     * 
     * @param query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            Client.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update User Detail
     * 
     * @param {Client} Client
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(Client: Client, payload: any, transaction?: Transaction): Promise<Client> {
        return new Promise(async (resolve, reject) => {
            if (Client) {
                Client.email = payload.email != null ? payload.email : Client.email;
                Client.last_name = payload.last_name != null ? payload.last_name : Client.last_name;         
                Client.first_name = payload.first_name != null ? payload.first_name : Client.first_name;
                Client.middle_name = payload.middle_name != null ? payload.middle_name : Client.middle_name;
              
                try {
                    await Client.save({ transaction: transaction });
                    resolve(Client);
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

export default ClientDAL;