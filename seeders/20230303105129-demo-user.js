"use strict";
const Helper = require("./../utils/helper");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Users", [
            {
                name: "Super Admin",
                email: "superadmin@redpen.com",
                password: Helper.hashPassword("!2345678"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Users", null, {});
    },
};
