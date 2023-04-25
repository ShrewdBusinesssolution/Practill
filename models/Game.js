"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Game extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Game.hasMany(models.Level, {
                foreignKey: {
                    name: "game_id",
                },
                as: "levels",
            });
        }
    }
    Game.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            title: DataTypes.STRING,
            description: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "Game",
            tableName: "games",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Game;
};
