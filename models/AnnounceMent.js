"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class AnnounceMent extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            AnnounceMent.belongsTo(models.User, {
                foreignKey: {
                    name: "announced_user_id",
                },
                as: "user",
            });
        }
    }
    AnnounceMent.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            announced_user_id: DataTypes.BIGINT,
            description: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: "AnnounceMent",
            tableName: "announcements",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return AnnounceMent;
};
