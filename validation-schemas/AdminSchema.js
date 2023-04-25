const Joi = require("joi").extend(require("@joi/date"));

/**
 * createAdminSchema
 */
const createAdminSchema = Joi.object({
    admin_id: Joi.string().trim().max(50).required().messages({
        "string.base": "Admin ID should be a type of string",
        "string.empty": "Admin ID is not allowed to be empty",
        "string.max": "Admin ID should be maximum 50 characters",
        "any.required": "Admin ID is a required field",
    }),


    first_name: Joi.string().trim().max(50).required().messages({
        "string.base": "First Name should be a type of string",
        "string.empty": "First Name is not allowed to be empty",
        "string.max": "First Name should be maximum 25 characters",
        "any.required": "First Name is a required field",
    }),

    last_name: Joi.string().trim().max(50).required().messages({
        "string.base": "Last Name should be a type of string",
        "string.empty": "Last Name is not allowed to be empty",
        "string.max": "Last Name should be maximum 25 characters",
        "any.required": "Last Name is a required field",
    }),

    email: Joi.string().min(3).required().email().required().messages({
        "string.base": "Email should be a type of string",
        "string.min": "Email should be minimum 20 characters",
        "string.email": "Enter valid email",
        "any.required": "Email is a required field",
    }),
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
    password: Joi.string().min(8).required().required().messages({
        "string.base": "Password should be a type of string",
        "string.min": "Password should be minimum 8 characters",
        "any.required": "Password is a required field",
    }),
});
// Export this module
module.exports = {
    createAdminSchema
};
