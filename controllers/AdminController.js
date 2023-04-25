const { User, Admin, UserToken, OTP, Coach } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const JwtHelper = require("@utils/jwt");
const { encrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { createAdminSchema } = require("@validation-schemas/AdminSchema");
const AuthController = require("@controllers/AuthController");

class AdminController {

    /**
     * createCoach
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static createAdmin = async (req, res, next) => {
        try {
            const result = await createAdminSchema.validateAsync(req.body);

            const doesExist = await Admin.findOne({ where: { admin_id: result.admin_id }, where: { email: result.email }, where: { mobile_number: result.mobile_number } });

            if (doesExist) throw createError.Conflict(`This Admin ID or Email or Mobile number is already exist`);

            const admin = await Admin.create({
                admin_id: result.admin_id,
                first_name: result.first_name,
                last_name: result.last_name,
                mobile_number: parseInt(result.mobile_number),
                email: result.email
            });

            if (!admin) throw createError.InternalServerError();

            const user = await User.create({
                login_id: result.admin_id,
                login_type: 'Admin',
                mobile_number: parseInt(result.mobile_number),
                email: result.email,
                password: await Helper.hashPassword(result.password)
            });

            res.status(201).json(
                Helper.successResponse(await AuthController.generateUserTokens(user.id), "Admin has been registered")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


}

// Export this module
module.exports = AdminController;
