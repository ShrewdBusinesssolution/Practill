"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class StudentInterest extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    StudentInterest.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            interest_id: DataTypes.BIGINT
        },
        {
            sequelize,
            modelName: "StudentInterest",
            tableName: "st_interests",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return StudentInterest;
};
