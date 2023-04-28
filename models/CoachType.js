"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CoachType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    CoachType.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            coach_type: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "CoachType",
            tableName: "coach_types",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return CoachType;
};
