"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CoachSchool extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoachSchool.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
                as: "user",
            });
            CoachSchool.belongsTo(models.School, {
                foreignKey: {
                    name: "school_id",
                },
                as: "school",
            });
        }
    }
    CoachSchool.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            school_id: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "CoachSchool",
            tableName: "coach_schools",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return CoachSchool;
};
