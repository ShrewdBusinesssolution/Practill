"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Interest extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Interest.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            title: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "Interest",
            tableName: "interests",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Interest;
};
