const Joi = require("joi").extend(require("@joi/date"));
/**
 * store Event
 */

const createEventSchema = Joi.object({
    title: Joi.string().trim().required().max(255).messages({
        "string.base": "Title should be a type of string",
        "string.empty": "Title is not allowed to be empty",
        "string.max": "Title should be maximum 255 characters",
    }),
    description: Joi.string().trim().max(1000).required().messages({
        "string.base": "Description should be a type of string",
        "string.empty": "Description is not allowed to be empty",
        "string.max": "Description should be maximum 1000 characters",
        "any.required": "Description is a required field",
    }),
    date: Joi.date().required().messages({
        "date.base": " date should be a type of date",
        "string.empty": "date is not allowed to be empty",
        "any.required": "date is a required field",
    })
});
/**
 * store Event
 */
const updateEventSchema = Joi.object({
    event_id: Joi.string().required().messages({
        "string.base": "Event ID should be a type of string",
        "string.empty": "Event ID is not allowed to be empty",
        "any.required": "Event ID is a required field",
    }),
    title: Joi.string().trim().required().max(255).messages({
        "string.base": "Title should be a type of string",
        "string.empty": "Title is not allowed to be empty",
        "string.max": "Title should be maximum 255 characters",
    }),
    description: Joi.string().trim().max(1000).required().messages({
        "string.base": "Description should be a type of string",
        "string.empty": "Description is not allowed to be empty",
        "string.max": "Description should be maximum 1000 characters",
        "any.required": "Description is a required field",
    }),
    event_image: Joi.string().allow('').messages({
        "string.base": "Event image should be a type of string",
    }),
    date: Joi.date().required().messages({
        "date.base": " date should be a type of date",
        "string.empty": "date is not allowed to be empty",
        "any.required": "date is a required field",
    })
});

/**
 * get Event
 */
const getEventSchema = Joi.object({
    page: Joi.number().integer().required().messages({
        "number.base": "Page should be a type of string",
        "number.empty": "Page is not allowed to be empty",
        "any.required": "Page is a required field",
    })
});

/**
 * delete Event
 */
const deleteEventSchema = Joi.object({
    event_id: Joi.string().required().messages({
        "string.base": "Event ID should be a type of string",
        "string.empty": "Event ID is not allowed to be empty",
        "any.required": "Event ID is a required field",
    })
});

// Export this module
module.exports = {
    createEventSchema,
    updateEventSchema,
    deleteEventSchema,
    getEventSchema
};
