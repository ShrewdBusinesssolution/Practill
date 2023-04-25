"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserToken.init(
        {
            user_id: DataTypes.INTEGER,
            refresh_token: DataTypes.TEXT,
            user_type: DataTypes.STRING,
            expiredAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "UserToken",
            tableName: "user_tokens",
            underscored: true,
            expiredAt: "expired_at",
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    UserToken.removeAttribute("id");
    return UserToken;
};
