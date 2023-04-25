"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Clue extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Clue.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            game_id: DataTypes.BIGINT,
            level_id: DataTypes.BIGINT,
            question_id: DataTypes.BIGINT,
            clue: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Clue",
            tableName: "clues",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Clue;
};
