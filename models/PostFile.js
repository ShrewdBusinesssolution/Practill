"use strict";
const { Model } = require("sequelize");
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
    class PostFile extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
        /**
* imageUrl
* @param {*} image_name
*/
        imageUrl(image_name) {
            return image_name != null
                ? process.env.BASE_URL+"/uploads/applications/post/" + image_name
                : null;
        }
        
    }
    PostFile.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            post_id: DataTypes.BIGINT,
            post_file: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "PostFile",
            tableName: "post_files",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return PostFile;
};
