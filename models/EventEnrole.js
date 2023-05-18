"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class EventEnrole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Event.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
                as: "user_id",
            });
        }
    }
    EventEnrole.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            event_list_id: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "EventEnrole",
            tableName: "event_enroles",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Event;
};
