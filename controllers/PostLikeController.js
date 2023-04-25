const { PostLike, Post } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { postLikeSchema } = require("@validation-schemas/PostSchema");
class PostController {
    
    
    /**
    * store and delete post like 
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static likePost = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            
            const result = await postLikeSchema.validateAsync(req.body);
            const post_id = decrypt(result.post_id);
            const post = await Post.findOne({
                where: {
                    id: post_id
                },
            });
            if (post==null) throw createError.Conflict("Invalid post");


            /**
             * TODO: when like is true add like, otherwise delete like
             */
            if (result.like) {
                const checkLike = await PostLike.findOne({
                    where: {
                        user_id: user_id,
                        post_id: post_id
                    },
                });
                if (checkLike) throw createError.Conflict("Already liked this post");

                var like = await PostLike.create({
                    user_id: user_id,
                    post_id: post_id,
                });


                /**
                 * save like notification
                 */
                var notification_data = {
                    user_id: post.user_id,
                    notifiable_type: 'posts',
                    notifiable_id: post_id,
                    notifiable_user_id: user_id,
                    description: `Liked your post.`,
                };

                const notification = await Helper.notification(notification_data);

                var message = "Liked successfully";
            }
            else
            {
                const checkLike = await PostLike.findOne({
                    where: {
                        user_id: user_id,
                        post_id: post_id
                    },
                });
                if (checkLike==null) throw createError.Conflict("Already removed");

                const postlike = await PostLike.findOne({
                    where: {
                        user_id: user_id,
                        post_id: post_id
                    },
                });
                var message = "Like removed successfully";
                var like = await postlike.destroy();
            }
            
            if (!like) throw createError.InternalServerError();
            
            res.status(201).json(
                Helper.successResponse([], message)
                );
            } catch (error) {
                if (error.isJoi == true) error.status = 422;
                next(error);
            }
        };
        
        
        
        
        
    }
    
    // Export this module
    module.exports = PostController;
    