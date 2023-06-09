"use strict";
const { Model } = require("sequelize");
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
        /**
* imageUrl
* @param {*} image_name
*/
        imageUrl(image_name) {
            return image_name != null
                ? process.env.BASE_URL + "/uploads/applications/user/" + image_name
                : null;
        }
    }
    Admin.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            profile_image: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            admin_id: DataTypes.STRING,
            user_id: DataTypes.BIGINT,
            mobile_number: DataTypes.BIGINT,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Admin",
            tableName: "admins",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Admin;
};
