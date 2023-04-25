const { loginSchema } = require("@validation-schemas/AuthSchema");
const { User, UserToken } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const JwtHelper = require("@utils/jwt");
const { encrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");

class AuthController {
    /**
     * login
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static login = async (req, res, next) => {
        try {
            const result = await loginSchema.validateAsync(req.body);

            const user = await User.findOne({
                where: {
                    mobile_number: result.mobile_number,
                },
            });

            if (user == null) throw createError.Conflict("Enter valid user details");

            // TODO: verify password
            const password_verification = await Helper.verifyPassword(result.password, user.password);
            if (!password_verification) throw createError.Conflict("Enter valid password");

            const encryptedUserId = await encrypt(user.id);

            const accessToken = await JwtHelper.signAccessToken(encryptedUserId, "user");
            const refreshToken = await JwtHelper.signRefreshToken(encryptedUserId, "user");

            const expiredAt = DateTimeHelper.addDaysToDateTime(DateTimeHelper.currentDateTime(), 30);

            const doesUserTokenExist = await UserToken.findOne({
                where: {
                    user_id: user.id,
                    user_type: "user",
                },
            });

            if (doesUserTokenExist != null) {
                const updatedToken = await doesUserTokenExist.update(
                    {
                        refresh_token: refreshToken,
                        expiredAt: expiredAt,
                    },
                    {
                        where: { user_id: user.id, user_type: "user" },
                    }
                );

                if (!updatedToken) throw createError.InternalServerError();
            } else {
                const saveToken = await UserToken.create({
                    user_id: user.id,
                    refresh_token: refreshToken,
                    user_type: "user",
                    expiredAt: expiredAt,
                });

                if (!saveToken) throw createError.InternalServerError();
            }

            res.json(Helper.successResponse({ accessToken, refreshToken }, "Login successfull!"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


    /**
   * generateUserTokens
   * @param {*} user_id
   */
    static generateUserTokens = async (user_id) => {
        const encryptedUserId = await encrypt(user_id);

        const accessToken = await JwtHelper.signAccessToken(encryptedUserId, "user");
        const refreshToken = await JwtHelper.signRefreshToken(encryptedUserId, "user");

        const expired_at = DateTimeHelper.addDaysToDateTime(DateTimeHelper.currentDateTime(), 30);

        const doesUserTokenExist = await UserToken.findOne({
            where: {
                user_id: user_id,
                user_type: "user",
            },
        });

        if (doesUserTokenExist != null) {
            const updatedToken = await doesUserTokenExist.update(
                {
                    refresh_token: refreshToken,
                    expired_at: expired_at,
                },
                {
                    where: { user_id: user_id, user_type: "user" },
                }
            );

            if (!updatedToken) throw createError.InternalServerError();
        } else {
            const saveToken = await UserToken.create({
                user_id: user_id,
                refresh_token: refreshToken,
                user_type: "user",
                expired_at: expired_at,
            });

            if (!saveToken) throw createError.InternalServerError();
        }

        return { accessToken, refreshToken };
    };
}

// Export this module
module.exports = AuthController;
