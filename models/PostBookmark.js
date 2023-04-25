"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PostBookmark extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
    
        }
    }
    PostBookmark.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.BIGINT,
            post_id: DataTypes.BIGINT
        },
        {
            sequelize,
            modelName: "PostBookmark",
            tableName: "post_bookmarks",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return PostBookmark;
};
