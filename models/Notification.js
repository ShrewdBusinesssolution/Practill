"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Notification.belongsTo(models.User, {
                foreignKey: {
                    name: "notifiable_user_id",
                },
                as: "user",
            });
        }
    }
    Notification.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            notifiable_user_id: DataTypes.BIGINT,
            notifiable_type: DataTypes.STRING,
            notifiable_id: DataTypes.BIGINT,
            description: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: "Notification",
            tableName: "notifications",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Notification;
};
