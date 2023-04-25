const { PostComment, Post } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { storeCommentSchema, deleteCommentSchema } = require("@validation-schemas/PostSchema");
class PostController {


    /**
    * store comment
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static storePostComment = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const result = await storeCommentSchema.validateAsync(req.body);
            const post_id = decrypt(result.post_id);
            const postcomment = result.comment;
            const post = await Post.findOne({
                where: {
                    id: post_id
                },
            });
            if (post==null) throw createError.Conflict("Invalid post");

       
                var comment = await PostComment.create({
                    user_id: user_id,
                    post_id: post_id,
                    comment: postcomment
                });
         

            if (!comment) throw createError.InternalServerError();


            /**
             * save comment notification
             */
            var notification_data = {
                user_id: post.user_id,
                notifiable_type: 'posts',
                notifiable_id: post_id,
                notifiable_user_id: user_id,
                description: `Commented your post.`,
            };

            const notification = await Helper.notification(notification_data);


            res.status(201).json(
                Helper.successResponse([], "Success")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };



    /**
    * delete post comment 
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static deletePostComment = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const result = await deleteCommentSchema.validateAsync(req.body);
            const post_id = decrypt(result.post_id);
            const comment_id = decrypt(result.comment_id);

                const comment = await PostComment.findOne({
                    where: {
                        user_id: user_id,
                        id: comment_id,
                        post_id: post_id
                    },
                });
            
            if (comment == null) throw createError.Conflict("Invalid Comment");

            const delete_comment = await comment.destroy();

            if (!delete_comment) throw createError.InternalServerError();

            res.status(201).json(
                Helper.successResponse([], "Success")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };



}

// Export this module
module.exports = PostController;
