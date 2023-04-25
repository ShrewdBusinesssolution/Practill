"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ClubJoin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ClubJoin.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
                as: "users",
            });
            ClubJoin.belongsTo(models.Club, {
                foreignKey: {
                    name: "club_id",
                },
                as: "clubs",
            });
        }

   
    }
    ClubJoin.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            club_id: DataTypes.BIGINT

        },
        {
            sequelize,
            modelName: "ClubJoin",
            tableName: "club_joined_users",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return ClubJoin;
};
