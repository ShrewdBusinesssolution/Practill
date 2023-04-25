"use strict";
const { Model } = require("sequelize");
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
    class Club extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Club.hasMany(models.ClubJoin, {
                foreignKey: {
                    name: "club_id",
                },
                as: "club_joined_users",
            });
            Club.hasMany(models.Post, {
                foreignKey: {
                    name: "club_id",
                },
                as: "posts",
            });
        }

        /**
    * imageUrl
    * @param {*} image_name
    */
        imageUrl(image_name) {
            return image_name != null
                ? process.env.BASE_URL+"/uploads/applications/club/" + image_name
                : null;
        }
    }
    Club.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
     
            },
            club_image: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            club_name: DataTypes.STRING,
            club_description: DataTypes.STRING,
            status: DataTypes.INTEGER,

        },
        {
            sequelize,
            modelName: "Club",
            tableName: "clubs",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Club;
};
