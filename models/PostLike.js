"use strict";
const { Model } = require("sequelize");
const { encrypt, decrypt } = require("@utils/crypto");
module.exports = (sequelize, DataTypes) => {
    class PostLike extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    PostLike.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                get() {
                    const id = this.getDataValue('id');
                    return id ? encrypt(id) : null;
                }
            },
            user_id: DataTypes.BIGINT,
            post_id: DataTypes.BIGINT
        },
        {
            sequelize,
            modelName: "PostLike",
            tableName: "post_likes",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return PostLike;
};
