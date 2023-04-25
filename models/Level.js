"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Level extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Level.hasMany(models.Question, {
                foreignKey: {
                    name: "level_id",
                },
                as: "questions",
            });
        }
    }
    Level.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            game_id: DataTypes.BIGINT ,
            level_type: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Level",
            tableName: "levels",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Level;
};
