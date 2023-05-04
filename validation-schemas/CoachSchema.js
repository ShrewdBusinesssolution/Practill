const Joi = require("joi").extend(require("@joi/date"));

/**
 * createCoachSchema
 */
const createCoachSchema = Joi.object({
    coach_id: Joi.string().trim().max(50).required().messages({
        "string.base": "Coach ID should be a type of string",
        "string.empty": "Coach ID is not allowed to be empty",
        "string.max": "Coach ID should be maximum 50 characters",
        "any.required": "Coach ID is a required field",
    }),
      coach_type_id: Joi.string().required().messages({
        "string.base": "Coach Type should be a type of string",
        "string.empty": "Coach Type is not allowed to be empty",
        "any.required": "Coach Type is a required field",
    }),

    name: Joi.string().trim().max(100).required().messages({
        "string.base": "Name should be a type of string",
        "string.empty": "Name is not allowed to be empty",
        "string.max": "Name should be maximum 100 characters",
        "any.required": " Name is a required field",
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


/**
 * updateCoachSchema
 */
const updateCoachSchema = Joi.object({
    coach_id: Joi.string().trim().max(50).required().messages({
        "string.base": "Coach ID should be a type of string",
        "string.empty": "Coach ID is not allowed to be empty",
        "string.max": "Coach ID should be maximum 50 characters",
        "any.required": "Coach ID is a required field",
    }),
  
    name: Joi.string().trim().max(100).required().messages({
        "string.base": "Name should be a type of string",
        "string.empty": "Name is not allowed to be empty",
        "string.max": "Name should be maximum 100 characters",
        "any.required": " Name is a required field",
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
    profile_image: Joi.string().allow('').messages({
        "string.base": "Profile image should be a type of string",
    }),
});

/**
 * deleteCoachSchema
 */
const deleteCoachSchema = Joi.object({
    coach_id: Joi.string().required().messages({
        "string.base": "Coach id should be a type of string",
        "string.empty": "Coach id is not allowed to be empty",
        "string.required": "Coach id is a required field",
    }),
});


/**
 * deleteCoachSchema
 */
const getCoachIdSchema = Joi.object({
    coach_type_id: Joi.string().required().messages({
        "string.base": "Coach type id should be a type of string",
        "string.empty": "Coach type id is not allowed to be empty",
        "string.required": "Coach type id is a required field",
    }),
});

/**
 * getCoachStudentSchema
 */
const getStudentSchema = Joi.object({
    school_id: Joi.string().required().messages({
        "string.base": "School should be a type of string",
        "string.empty": "School is not allowed to be empty",
        "string.required": "School is a required field",
    }),
    grad: Joi.string().required().messages({
        "string.base": "Grad should be a type of string",
        "string.empty": "Grad is not allowed to be empty",
        "string.required": "Grad is a required field",
    }),
});
// Export this module
module.exports = {
    createCoachSchema,
    deleteCoachSchema,
    getCoachIdSchema,
    getStudentSchema,
    updateCoachSchema
};
