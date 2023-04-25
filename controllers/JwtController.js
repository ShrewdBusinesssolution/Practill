const Helper = require("@utils/helper");
const { verifyRefreshTokenSchema } = require("@validation-schemas/AuthSchema");
const { UserToken } = require("@models");
const createError = require("http-errors");
const JwtHelper = require("@utils/jwt");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
class JwtController {
    /**
     * refreshToken
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static refreshToken = async (req, res, next) => {
        try {
            const result = await verifyRefreshTokenSchema.validateAsync(req.body);

            const validate_refresh_token = await JwtHelper.verifyRefreshToken(result.refresh_token);

            const encrypted_user_id = validate_refresh_token.user_id;
            const user_type = validate_refresh_token.user_type;

            const get_token_details = await UserToken.findOne({
                where: { user_type: user_type, refresh_token: result.refresh_token },
            });

            if (!get_token_details) throw createError.Unauthorized();

            // TODO: verify wheather db user_id and token user id are same or not
            if (get_token_details.user_id != parseInt(decrypt(encrypted_user_id))) throw createError.Unauthorized();

            const encryptedUserId = await encrypt(get_token_details.user_id);

            const accessToken = await JwtHelper.signAccessToken(encryptedUserId, get_token_details.user_type);
            const refreshToken = await JwtHelper.signRefreshToken(encryptedUserId, get_token_details.user_type);

            const expiredAt = DateTimeHelper.addDaysToDateTime(DateTimeHelper.currentDateTime(), 30);

            const updatedToken = await UserToken.update(
                {
                    refresh_token: refreshToken,
                    expiredAt: expiredAt,
                },
                {
                    where: { user_id: get_token_details.user_id, user_type: user_type },
                }
            );
            if (!updatedToken) throw createError.InternalServerError();

            res.json(Helper.successResponse({ accessToken, refreshToken }, "Token has been re-issued"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };
}

module.exports = JwtController;
