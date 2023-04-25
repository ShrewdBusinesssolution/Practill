const Joi = require("joi").extend(require("@joi/date"));

/**
 * answer
 */
const studentAnswerSchema = Joi.object({

    game_id: Joi.string().required().messages({
        "string.base": "Game ID should be a type of string",
        "string.empty": "Game ID  is not allowed to be empty",
        "any.required": "Game ID  is a required field",
    }),
    level_id: Joi.string().required().messages({
        "string.base": "Level ID should be a type of string",
        "string.empty": "Level ID  is not allowed to be empty",
        "any.required": "Level ID  is a required field",
    }),
    question_id: Joi.string().required().messages({
        "string.base": "Question ID should be a type of string",
        "string.empty": "Question ID  is not allowed to be empty",
        "any.required": "Question ID  is a required field",
    }),
    answer: Joi.string().trim().max(255).required().messages({
        "string.base": "Answer should be a type of string",
        "string.empty": "Answer is not allowed to be empty",
        "string.max": "Answer should be maximum 100 characters",
        "any.required": "Answer is a required field",
    }),


});
// Export this module
module.exports = {
    studentAnswerSchema
};
