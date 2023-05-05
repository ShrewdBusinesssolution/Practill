const Joi = require("joi").extend(require("@joi/date"));

/**
 * store post
 */
const createPostSchema = Joi.object({

    club_id: Joi.string().allow("").messages({
        "string.base": "Club ID should be a type of string",
    }),
    post_type: Joi.string().required().messages({
        "string.base": "Post Type should be a type of string",
        "string.empty": "Post Type is not allowed to be empty",
        "any.required": "Post Type is a required field",
    }),
    file_type: Joi.string().required().messages({
        "string.base": "File Type should be a type of string",
        "string.empty": "File Type is not allowed to be empty",
        "any.required": "File Type is a required field",
    }),
    title: Joi.string().trim().max(255).messages({
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
    tag_user: Joi.array().max(10).allow('').messages({
        "array.base": "Tag user should be a type of array",
        "array.max": "Tag user field is maximum {{#limit}} allowed."
    }),
    post_file: Joi.array().max(5).allow('').messages({
        "array.base": "Post file should be a type of array",
        "array.max": "Post file field is maximum {{#limit}} allowed."
    }),
});

/**
 * update post
 */
const updatePostSchema = Joi.object({
    post_id: Joi.string().required().messages({
        "string.base": "Post ID should be a type of string",
        "string.empty": "Post ID is not allowed to be empty",
        "any.required": "Post ID is a required field",
    }),
    title: Joi.string().trim().max(255).messages({
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
    tag_user: Joi.array().max(10).allow('').messages({
        "array.base": "Tag user should be a type of array",
        "array.max": "Tag user field is maximum {{#limit}} allowed."
    }),

});


/**
 * delete post
 */
const deletePostSchema = Joi.object({
    post_id: Joi.string().required().messages({
        "string.base": "Post ID should be a type of string",
        "string.empty": "Post ID is not allowed to be empty",
        "any.required": "Post ID is a required field",
    })
});

/**
 * post likes
 */
const postLikeSchema = Joi.object({
    post_id: Joi.string().required().messages({
        "string.base": "Post ID should be a type of string",
        "string.empty": "Post ID is not allowed to be empty",
        "any.required": "Post ID is a required field",
    }),
    like: Joi.boolean().required().messages({
        "boolean.base": "Like should be a type of boolean",
        "boolean.empty": "Like is not allowed to be empty",
        "boolean.required": "Like  is a required field",
    }),
});

/**
 * get comments data
 */
const getCommentSchema = Joi.object({
    post_id: Joi.string().required().messages({
        "string.base": "Post ID should be a type of string",
        "string.empty": "Post ID is not allowed to be empty",
    }),
    page: Joi.number().integer().required().messages({
        "number.base": "Page should be a type of integer",
        "number.empty": "Page is not allowed to be empty",
        "any.required": "Page is a required field",
    }),

});


/**
 * post comments
 */
const storeCommentSchema = Joi.object({
    post_id: Joi.string().required().messages({
        "string.base": "Post ID should be a type of string",
        "string.empty": "Post ID is not allowed to be empty",
        "any.required": "Post ID is a required field",
    }),
    comment: Joi.string().trim().max(500).required().messages({
        "string.base": "comment should be a type of string",
        "string.empty": "comment is not allowed to be empty",
        "string.max": "comment should be maximum 100 characters",
        "any.required": "comment is a required field",
    }),
});

/**
 * delete comment
 */
const deleteCommentSchema = Joi.object({
    post_id: Joi.string().required().messages({
        "string.base": "Post ID should be a type of string",
        "string.empty": "Post ID is not allowed to be empty",
        "any.required": "Post ID is a required field",
    }),
    comment_id: Joi.string().required().messages({
        "string.base": "Comment ID should be a type of string",
        "string.empty": "Comment ID is not allowed to be empty",
        "any.required": "Comment ID is a required field",
    }),
  
});

/**
 * post bookmarks
 */
const postBookmarkSchema = Joi.object({
    post_id: Joi.string().required().messages({
        "string.base": "Post ID should be a type of string",
        "string.empty": "Post ID is not allowed to be empty",
        "any.required": "Post ID is a required field",
    }),
    bookmark: Joi.boolean().required().messages({
        "boolean.base": "Bookmark should be a type of boolean",
        "boolean.empty": "Bookmark is not allowed to be empty",
        "boolean.required": "Bookmark  is a required field",
    }),
});

/**
 * get post details
 */
const getPostSchema = Joi.object({
    club_id: Joi.string().allow('').messages({
        "string.base": "Club ID should be a type of string",
        "string.empty": "Club ID is not allowed to be empty",
    }),
    post_type: Joi.string().required().messages({
        "string.base": "Post Type should be a type of string",
        "string.empty": "Post Type is not allowed to be empty",
        "string.required": "Post Type  is a required field",
    }),
    page: Joi.number().integer().required().messages({
        "number.base": "Page should be a type of integer",
        "number.empty": "Page is not allowed to be empty",
        "any.required": "Page  is a required field",
    }),
});


/**
 * delete tag users
 */
const deleteTagSchema = Joi.object({
    tag_id: Joi.string().required().messages({
        "string.base": "Tag ID should be a type of string",
        "string.empty": "Tag ID is not allowed to be empty",
        "any.required": "Tag ID is a required field",
    }),

});


/**
 * student activity
 */
const studentActivitySchema = Joi.object({
    user_id: Joi.string().allow('').messages({
        "string.base": "User ID should be a type of string",
        "string.empty": "User ID is not allowed to be empty",
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


/**
 * club activity
 */
const clubActivitySchema = Joi.object({
    user_id: Joi.string().allow('').messages({
        "string.base": "User ID should be a type of string",
        "string.empty": "User ID is not allowed to be empty",
    }),
    club_id: Joi.string().allow('').messages({
        "string.base": "Club ID should be a type of string",
        "string.empty": "Club ID is not allowed to be empty",
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
    createPostSchema,
    updatePostSchema,
    deletePostSchema,
    postLikeSchema,
    getCommentSchema,
    storeCommentSchema,
    deleteCommentSchema,
    getPostSchema,
    postBookmarkSchema,
    deleteTagSchema,
    studentActivitySchema,
    clubActivitySchema
};
