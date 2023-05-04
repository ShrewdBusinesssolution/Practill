"use strict";
const { Model } = require("sequelize");
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Student.belongsTo(models.School, {
                foreignKey: {
                    name: "school_id",
                },
                as: "schools",
            });
            Student.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
                as: "user",
            });
            Student.hasMany(models.StudentAnswer, {
                foreignKey: {
                    name: "user_id",
                },
                as: "answers",
            });
        }
        /**
       * imageUrl
       * @param {*} image_name
       */
        imageUrl(image_name) {
            return image_name != null
                ? process.env.BASE_URL+"/uploads/applications/user/" + image_name
                : null;
        }
    }
    Student.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            profile_image: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            user_id: DataTypes.BIGINT,
            mobile_number: DataTypes.BIGINT,
            name: DataTypes.STRING,
            grad: DataTypes.STRING,
            reward_points: DataTypes.DOUBLE(10, 2),
            school_id: DataTypes.BIGINT,
            school_name: {
                allowNull: true,
                type: DataTypes.STRING,
            }
        },
        {
            sequelize,
            modelName: "Student",
            tableName: "students",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Student;
};
