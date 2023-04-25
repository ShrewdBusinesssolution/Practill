const Joi = require("joi").extend(require("@joi/date"));

/**
 * loginSchema
 */
const loginSchema = Joi.object({
      mobile_number: Joi.string()
        .trim()
        .regex(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.base": "Mobile number should be a type of string",
            "string.empty": "Mobile number is not allowed to be empty",
            "string.pattern.base": "Mobile number must be 10 digit number",
            "any.required": "Mobile number is a required field",
        }),
    password: Joi.string().min(8).required().messages({
        "string.base": "Password should be a type of string",
        "string.min": "Password should be minimum 8 characters",
        "any.required": "Password is a required field",
    }),
});

/**
 * verifyRefreshTokenSchema
 */
const verifyRefreshTokenSchema = Joi.object({
    refresh_token: Joi.string().trim().required().messages({
        "string.base": "Refresh token should be a type of string",
        "string.empty": "Refresh token is not allowed to be empty",
        "any.required": "Refresh token is a required field",
    }),
});
// Export this module
module.exports = {
    loginSchema,
    verifyRefreshTokenSchema,
};
