"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PostTag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PostTag.belongsTo(models.User, {
                foreignKey: {
                    name: "tag_user_id",
                },
                as: "user",
            });
        }
    }
    PostTag.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            post_id: DataTypes.BIGINT,
            tag_user_id: DataTypes.BIGINT
        },
        {
            sequelize,
            modelName: "PostTag",
            tableName: "post_tags",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return PostTag;
};
