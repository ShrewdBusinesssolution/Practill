"use strict";
require('dotenv').config();
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Certificate extends Model {
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
                ? process.env.BASE_URL+"/uploads/applications/certificate/" + image_name
                : null;
        }
    }
    Certificate.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
     
            },
            certificate_image: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            title: DataTypes.STRING,
            description: DataTypes.STRING

        },
        {
            sequelize,
            modelName: "Certificate",
            tableName: "certificates",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Certificate;
};
