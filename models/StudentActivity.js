"use strict";
const { Model } = require("sequelize");
const { encrypt, decrypt } = require("@utils/crypto");
module.exports = (sequelize, DataTypes) => {
    class StudentActivity extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        
        }
    }
    StudentActivity.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            activity_type: DataTypes.ENUM("App", "Class"),
            percentage_type: DataTypes.STRING,
            percentage: DataTypes.DOUBLE(3, 2),
            reward_points: DataTypes.DOUBLE(10, 2),

        },
        {
            sequelize,
            modelName: "StudentActivity",
            tableName: "st_activities",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return StudentActivity;
};
