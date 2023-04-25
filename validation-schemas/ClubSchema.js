const Joi = require("joi").extend(require("@joi/date"));

/**
 * createClubSchema
 */
const createClubSchema = Joi.object({
    club_name: Joi.string().required().messages({
        "string.base": "Club Name should be a type of string",
        "any.required": "Club Name is a required field",
    }),
    club_description: Joi.string().max(1000).required().messages({
        "string.base": "Club Description should be a type of string",
        "string.empty": "Club Description is not allowed to be empty",
        "string.max": "Club Description should be maximum 1000 characters"
    }),
});

/**
 * deleteClubSchema
 */
const deleteClubSchema = Joi.object({
    club_id: Joi.number().required().messages({
        "number.base": "Club id should be a type of integer",
        "number.empty": "Club id is not allowed to be empty",
        "number.required": "Club id is a required field",
    }),
});

/**
 * joinClubSchema
 */
const joinClubSchema = Joi.object({
    club_id: Joi.string().required().messages({
        "string.base": "Club id should be a type of string",
        "string.empty": "Club id is not allowed to be empty",
        "string.required": "Club id is a required field",
    }),
});


// Export this module
module.exports = {
    createClubSchema,
    deleteClubSchema,
    joinClubSchema
};
