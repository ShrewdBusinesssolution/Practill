"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class StudentCertificate extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
  
            StudentCertificate.belongsTo(models.Certificate, {
                foreignKey: {
                    name: "certificate_id",
                },
                as: "certificates",
            });
        }

   
    }
    StudentCertificate.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
         
            },
            user_id: DataTypes.BIGINT,
            certificate_id: DataTypes.BIGINT

        },
        {
            sequelize,
            modelName: "StudentCertificate",
            tableName: "st_certificates",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return StudentCertificate;
};
