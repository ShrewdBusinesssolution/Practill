"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class StudentAnswer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    StudentAnswer.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            game_id: DataTypes.BIGINT,
            level_id: DataTypes.BIGINT,
            question_id: DataTypes.BIGINT,
            answer: DataTypes.STRING,
            is_correct: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "StudentAnswer",
            tableName: "st_answers",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return StudentAnswer;
};
