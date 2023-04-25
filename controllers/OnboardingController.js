const {Onboarding } = require("@models");
const Helper = require("@utils/helper");

class OnboardingController {

    /**
     * get onboarding details
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static index = async (req, res, next) => {
        try {
            const onboard = await Onboarding.findAll();
            var data =[]

            onboard.forEach((element) => {
                const record = {
                    title: element.title,
                    image: element.imageUrl(element.onboard_image),
                    description: element.description,
                };
                data.push(record);
            });

            res.json(Helper.successResponse( data , "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


}

// Export this module
module.exports = OnboardingController;
