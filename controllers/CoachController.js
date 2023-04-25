const { User, UserToken, OTP, Coach } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const JwtHelper = require("@utils/jwt");
const { encrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { createCoachSchema, deleteCoachSchema } = require("@validation-schemas/CoachSchema");
const AuthController = require("@controllers/AuthController");

class CoachController {

    /**
     * createCoach
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static createCoach = async (req, res, next) => {
        try {
            const result = await createCoachSchema.validateAsync(req.body);

            const doesExist = await Coach.findOne({ where: { coach_id: result.coach_id }, where: { email: result.email }, where: { mobile_number: result.mobile_number } });

            if (doesExist) throw createError.Conflict(`This Coach ID or Email or Mobile number is already exist`);

            const coach = await Coach.create({
                coach_id: result.coach_id,
                first_name: result.first_name,
                last_name: result.last_name,
                mobile_number: parseInt(result.mobile_number),
                email: result.email
            });

            if (!coach) throw createError.InternalServerError();

            const user = await User.create({
                login_id: result.coach_id,
                login_type: 'Coach',
                mobile_number: parseInt(result.mobile_number),
                email: result.email,
                password: await Helper.hashPassword(result.password)
            });

            res.status(201).json(
                Helper.successResponse(await AuthController.generateUserTokens(user.id), "Coach has been registered")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
    * deleteClub
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static deleteCoach = async (req, res, next) => {
        try {
            const result = await deleteCoachSchema.validateAsync(req.body);
            const coach_id = result.coach_id;

            const coach = await Coach.findOne({
                where: {
                    coach_id: coach_id,
                },
            });

            if (!coach) throw createError.Conflict("Provide valid Coach details");

            const delete_coach = await coach.destroy();
            if (!delete_coach) throw createError.InternalServerError("Something went wrong!");

            const user = await User.findOne({
                where: {
                    login_id: coach_id,
                },
                where: {
                    login_type: "Coach",
                },
            });
            const delete_user = await user.bulkDelete();
            res.json(Helper.successResponse("", "Coach deleted succefully!"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }


    }


}

// Export this module
module.exports = CoachController;
