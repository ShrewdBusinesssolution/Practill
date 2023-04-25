"use strict";
const { Model } = require("sequelize");
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
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
                ? process.env.BASE_URL+"/uploads/applications/event/" + image_name
                : null;
        }
    }
    Event.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            title: DataTypes.STRING,
            event_image: DataTypes.STRING,
            date: DataTypes.DATE,
            description: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: "Event",
            tableName: "events",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Event;
};
