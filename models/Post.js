"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Post.hasMany(models.PostFile, {
                foreignKey: {
                    name: "post_id",
                },
                as: "post_files",
            });
            Post.hasMany(models.PostLike, {
                foreignKey: {
                    name: "post_id",
                },
                as: "post_likes",
            });
            Post.hasMany(models.PostComment, {
                foreignKey: {
                    name: "post_id",
                },
                as: "post_comments",
            });
            Post.hasMany(models.PostTag, {
                foreignKey: {
                    name: "post_id",
                },
                as: "post_tags",
            });
            Post.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
                as: "user",
            });
            Post.belongsTo(models.Club, {
                foreignKey: {
                    name: "club_id",
                },
                as: "club",
            });
        }
    }
    Post.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            post_type: DataTypes.ENUM("general", "club"),
            file_type: DataTypes.ENUM("video", "image","document"),
            club_id: DataTypes.BIGINT,
            title: DataTypes.STRING,
            description: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "Post",
            tableName: "posts",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Post;
};
