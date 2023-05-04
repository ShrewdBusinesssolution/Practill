const { Game } = require("@models");
const { encrypt, decrypt } = require("@utils/crypto");
const Helper = require("@utils/helper");

class GameController {

    /**
     * get game details
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static index = async (req, res, next) => {
        try {
            const event = await Game.findAll();
            var data = []

            event.forEach((element) => {
                const record = {
                    id: encrypt(element.id),
                    title: element.title,
                    description: element.description,
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
module.exports = GameController;
