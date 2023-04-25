"use strict";
const { Model } = require("sequelize");
const { encrypt, decrypt } = require("@utils/crypto");
module.exports = (sequelize, DataTypes) => {
    class PostComment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PostComment.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
                as: "user",
            });
        }
    }
    PostComment.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            post_id: DataTypes.BIGINT,
            comment: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "PostComment",
            tableName: "post_comments",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return PostComment;
};
