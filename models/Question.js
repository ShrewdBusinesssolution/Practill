"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Question.hasMany(models.Clue, {
                foreignKey: {
                    name: "question_id",
                },
                as: "clues",
            });
            Question.belongsTo(models.Level, {
                foreignKey: {
                    name: "level_id",
                },
                as: "level",
            });
            Question.belongsTo(models.Game, {
                foreignKey: {
                    name: "game_id",
                },
                as: "game",
            });
        }
    }
    Question.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            game_id: DataTypes.BIGINT,
            level_id: DataTypes.BIGINT,
            question: DataTypes.STRING,
            answer: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Question",
            tableName: "questions",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Question;
};
