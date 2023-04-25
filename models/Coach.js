"use strict";
const { Model } = require("sequelize");
const Helper = require("@utils/helper");
module.exports = (sequelize, DataTypes) => {
    class Coach extends Model {
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
                ? Helper.baseUrl+"/uploads/applications/user/" + image_name
                : null;
        }
    }
    Coach.init(
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
            user_id: DataTypes.BIGINT,
            coach_id: DataTypes.STRING,
            mobile_number: DataTypes.BIGINT,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Coach",
            tableName: "coaches",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Coach;
};
