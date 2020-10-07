import { IncludeOptions, Transaction } from "sequelize/types";
import { UserDetail, User } from "../../helpers/database/Sequelize";

class UserDetailDAL {


    /**
     * Create User Detail
     * 
     * @param user_id 
     * @param first_name 
     * @param middle_name 
     * @param last_name 
     * @param locale 
     * @param phone_number 
     * @param email 
     * @param gender 
     * @param birth_day 
     * @param recruited_by 
     * @param literacy_level 
     * @param kebele 
     * @param latitude 
     * @param longitude 
     * @param store_id 
     * @param supplier_id 
     * @param location_id 
     * @param sub_location_id 
     * @param created_by 
     * @param transaction 
     */
    static create(user_id: number, first_name: string, middle_name: string, last_name: string, locale: string, phone_number?: string, email?: string, gender?: string, birth_day?: string, recruited_by?: string, literacy_level?: string, kebele?: string, latitude?: number, longitude?: number, store_id?: number, supplier_id?: number, location_id?: number, sub_location_id?: number, created_by?: string, transaction?: Transaction): Promise<UserDetail> {
        return new Promise((resolve, reject) => {
            UserDetail.create({ 
                email: email, 
                kebele: kebele, 
                locale: locale,
                gender: gender, 
                user_id: user_id, 
                birth_day: birth_day, 
                latitude: latitude, 
                store_id: store_id,
                last_name: last_name, 
                longitude: longitude, 
                first_name: first_name, 
                created_by: created_by,
                updated_by: created_by,
                location_id: location_id, 
                middle_name: middle_name, 
                supplier_id: supplier_id, 
                recruited_by: recruited_by, 
                phone_number: phone_number, 
                literacy_level: literacy_level, 
                sub_location_id: sub_location_id,
            }, { transaction: transaction })
                .then((result: UserDetail) => resolve(result))
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
    static findMany(query: any, user_type: number, order: any, includes: any): Promise<UserDetail[]> {
        return new Promise((resolve, reject) => {
            UserDetail.findAll({ where: query, include: [ { model: User, where: { user_type_id: user_type } }, ...includes ], order: order })
                .then((result: UserDetail[]) => resolve(result))
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
    static findManyPaginate(query: any, user_type: number, order: any, includes: any, page: number = 1, limit: number = 25): Promise<UserDetail[]> {
        return new Promise((resolve, reject) => {
            UserDetail.findAll({ where: query, include: [ { model: User, where: { user_type_id: user_type } }, ...includes ], order: order, limit: limit, offset: (page - 1) * limit })
                .then((result: UserDetail[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find One User Detail
     * 
     * @param {any}     query 
     * @param {number}  user_type 
     */
    static findOne(query: any, user_type: number, order: any, includes: any): Promise<UserDetail> {
        return new Promise((resolve, reject) => {
            UserDetail.findOne({ where: query, include: [ { model: User, where: { user_type_id: user_type } }, ...includes ], order: order })
                .then((result: UserDetail) => resolve(result))
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
            UserDetail.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update User Detail
     * 
     * @param {UserDetail} userDetail
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(userDetail: UserDetail, payload: any, transaction?: Transaction): Promise<UserDetail> {
        return new Promise(async (resolve, reject) => {
            if (userDetail) {
                userDetail.email = payload.email != null ? payload.email : userDetail.email;
                userDetail.kebele = payload.kebele != null ? payload.kebele : userDetail.kebele;
                userDetail.gender = payload.gender != null ? payload.gender : userDetail.gender;
                userDetail.latitude = payload.latitude != null ? payload.latitude : userDetail.latitude;
                userDetail.birth_day = payload.birth_day != null ? payload.birth_day : userDetail.birth_day;
                userDetail.last_name = payload.last_name != null ? payload.last_name : userDetail.last_name;
                userDetail.longitude = payload.longitude != null ? payload.longitude : userDetail.longitude;
                userDetail.first_name = payload.first_name != null ? payload.first_name : userDetail.first_name;
                userDetail.middle_name = payload.middle_name != null ? payload.middle_name : userDetail.middle_name;
                userDetail.recruited_by = payload.recruited_by != null ? payload.recruited_by : userDetail.recruited_by;
                userDetail.literacy_level = payload.literacy_level != null ? payload.literacy_level : userDetail.literacy_level;

                try {
                    await userDetail.save({ transaction: transaction });
                    resolve(userDetail);
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

export default UserDetailDAL;