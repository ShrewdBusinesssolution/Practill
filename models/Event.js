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
            Event.belongsTo(models.School, {
                foreignKey: {
                    name: "school_id",
                },
                as: "school",
            });
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
            user_id: DataTypes.BIGINT,
            school_id: DataTypes.BIGINT,
            grad: DataTypes.STRING,
            title: DataTypes.STRING,
            event_image: DataTypes.STRING,
            date: DataTypes.DATE,
            description: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: "Event",
            tableName: "event_lists",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Event;
};
