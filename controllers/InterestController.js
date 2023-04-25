const { Interest } = require("@models");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
class InterestController {

    /**
     * get interest details
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static index = async (req, res, next) => {
        try {
            const interest = await Interest.findAll();
            var data = []

            interest.forEach((element) => {
                const record = {
                    id:encrypt(element.id),
                    title: element.title,
                };
                data.push(record);
            });

            res.json(Helper.successResponse( data, "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


}

// Export this module
module.exports = InterestController;
