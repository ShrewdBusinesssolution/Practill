"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.hasOne(models.Student, {
                foreignKey: {
                    name: "user_id",
                },
                as: "student",
            });
            User.hasOne(models.Coach, {
                foreignKey: {
                    name: "user_id",
                },
                as: "coach",
            });
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.STRING,
            user_type: DataTypes.STRING,
            mobile_number: DataTypes.BIGINT,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return User;
};
