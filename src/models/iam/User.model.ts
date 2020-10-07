import { v4 as uuidv4 } from 'uuid';
import { Sequelize, Model, DataTypes } from 'sequelize';

export class User extends Model {
    public id!: number;
    public user_code!: string;
    public user_type!: string;

    public username!: string;
    public password!: string;

    public is_active!: boolean;
    public is_locked!: boolean;
    
    public created_by: string;
    public updated_by: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        user_code:{
          type: DataTypes.STRING,
          allowNull: false
        },
        user_type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        is_locked: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
      }
       
        
    }, {
        sequelize,
        modelName: "user",
        tableName: "users",
        createdAt: "created_at",
        updatedAt: "updated_at",
        hooks: {
          beforeValidate: async (instance) => {
              if (!instance.user_code) {
                  instance.user_code = uuidv4();
              }
          }
      }
    });
};