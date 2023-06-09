const Joi = require("joi").extend(require("@joi/date"));

/**
 * createStudentSchema
 */
const createStudentSchema = Joi.object({

    name: Joi.string().trim().max(100).required().messages({
        "string.base": "Name should be a type of string",
        "string.empty": "Name is not allowed to be empty",
        "string.max": "Name should be maximum 100 characters",
        "any.required": "Name is a required field",
    }),

    grad: Joi.string().max(20).required().messages({
        "string.base": "Grad should be a type of string",
        "string.min": "Grad should be minimum 20 characters",
        "any.required": "Grad is a required field",
    }),
    school_id: Joi.string().required().messages({
        "string.base": "School ID should be a type of string",
        "string.empty": "School ID  is not allowed to be empty",
        "any.required": "School ID  is a required field",
    }),
    school_name: Joi.string().allow('').messages({
        "string.base": "School Name should be a type of string"
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
    interest_id: Joi.array().required().messages({
        "array.base": "Interest should be a type of array",
    })
});

/**
 * updateStudentSchema
 */
const updateStudentSchema = Joi.object({

    name: Joi.string().trim().max(100).required().messages({
        "string.base": "Name should be a type of string",
        "string.empty": "Name is not allowed to be empty",
        "string.max": "Name should be maximum 100 characters",
        "any.required": "Name is a required field",
    }),

    grad: Joi.string().max(20).required().messages({
        "string.base": "Grad should be a type of string",
        "string.min": "Grad should be minimum 20 characters",
        "any.required": "Grad is a required field",
    }),
    school_id: Joi.string().required().messages({
        "string.base": "School ID should be a type of string",
        "string.empty": "School ID  is not allowed to be empty",
        "any.required": "School ID  is a required field",
    }),
    school_name: Joi.string().allow('').messages({
        "string.base": "School Name should be a type of string"
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
    address: Joi.string().trim().max(1000).required().messages({
        "string.base": "Address should be a type of string",
        "string.empty": "Address is not allowed to be empty",
        "string.max": "Address should be maximum 100 characters",
        "any.required": " Address is a required field",
    }),
});

/**
 * activity schema
 */

const getActivitySchema = Joi.object({
    year: Joi.number().integer().required().messages({
        "number.base": "Year should be a type of number",
        "number.empty": "Year is not allowed to be empty",
        "any.required": "Year is a required field",
    }),
    month: Joi.number().integer().required().messages({
        "number.base": "Month should be a type of number",
        "number.empty": "Month is not allowed to be empty",
        "any.required": "Month is a required field",
    }),
});

/**
 * student certificate 
 */
const studentCertificateSchema = Joi.object({
    user_id: Joi.string().allow('').messages({
        "string.base": "User ID should be a type of string",
        "string.empty": "User ID is not allowed to be empty",
    }),
    certificate_id: Joi.string().allow('').messages({
        "string.base": "Certificate ID should be a type of string",
        "string.empty": "Certificate ID is not allowed to be empty",
    }),
    filter_type: Joi.string().required().messages({
        "string.base": "Filter Type should be a type of string",
        "string.empty": "Filter Type is not allowed to be empty",
        "any.required": "Filter Type is a required field",
    }),
    page: Joi.number().integer().required().messages({
        "number.base": "Page should be a type of integer",
        "number.empty": "Page is not allowed to be empty",
        "any.required": "Page is a required field",
    }),

});

// Export this module
module.exports = {
    createStudentSchema,
    updateStudentSchema,
    getActivitySchema,
    studentCertificateSchema
};
