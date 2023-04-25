const { Event } = require("@models");
const { encrypt, decrypt } = require("@utils/crypto");
const Helper = require("@utils/helper");

class EventController {

    /**
     * get onboarding details
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static index = async (req, res, next) => {
        try {
            const event = await Event.findAll();
            var data = []

            event.forEach((element) => {
                const record = {
                    id:encrypt(element.id),
                    title: element.title,
                    image: element.imageUrl(element.event_image),
                    description: element.description,
                    date: element.date,

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
module.exports = EventController;
