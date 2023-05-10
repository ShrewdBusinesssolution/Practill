"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CoachGrad extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoachGrad.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
                as: "user",
            });
        }
    }
    CoachGrad.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            school_id: DataTypes.BIGINT,
            grad: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: "CoachGrad",
            tableName: "coach_grads",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return CoachGrad;
};

