"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class StudentDashboard extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    StudentDashboard.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            description: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "StudentDashboard",
            tableName: "st_dashboards",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return StudentDashboard;
};
