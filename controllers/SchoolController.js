const { School } = require("@models");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
class SchoolController {

    /**
     * get school details
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static index = async (req, res, next) => {
        try {
            const school = await School.findAll();
            var data = []

            school.forEach((element) => {
                const record = {
                    id: encrypt(element.id),
                    school_name: element.school_name,
                };
                data.push(record);
            });

            res.json(Helper.successResponse(data, "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


}

// Export this module
module.exports = SchoolController;
