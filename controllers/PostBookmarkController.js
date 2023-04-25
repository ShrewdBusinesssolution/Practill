const { Post, PostComment, PostBookmark, PostLike, PostTag, PostFile, User, Student, Coach} = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { postBookmarkSchema } = require("@validation-schemas/PostSchema");
const Op = require('sequelize').Op;

class PostBookmarkController {


    /**
    * store and delete post bookmark 
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static bookmarkPost = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const result = await postBookmarkSchema.validateAsync(req.body);
            const post_id = decrypt(result.post_id);

            /**
             * TODO: when bookmark is true add bookmark, otherwise delete bookmark
             */
            if (result.bookmark) {
                const checkBookmark = await PostBookmark.findOne({
                    where: {
                        user_id: user_id,
                        post_id: post_id
                    },
                });
                if (checkBookmark) throw createError.Conflict("Already Bookmarked this post");

                var bookmark = await PostBookmark.create({
                    user_id: user_id,
                    post_id: post_id,
                });
                var message = "Bookmark is saved";
            }
            else {
                const checkBookmark = await PostBookmark.findOne({
                    where: {
                        user_id: user_id,
                        post_id: post_id
                    },
                });
                if (checkBookmark==null) throw createError.Conflict("Already removed bookmark this post");


                const postBookmark = await PostBookmark.findOne({
                    where: {
                        user_id: user_id,
                        post_id: post_id
                    },
                });
                var bookmark = await postBookmark.destroy();
                var message = "Bookmark is removed";
            }

            if (!bookmark) throw createError.InternalServerError();

            res.status(201).json(
                Helper.successResponse([], message)
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


        /**
         * my bookmark details
         * @param {*} req
         * @param {*} res
         * @param {*} next
         */
    static mybookmarkDetails = async (req, res, next) => {
        try {

            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const limit = 10;
            const offset = 0 + (req.body.page - 1) * limit;

            const bookmark = await PostBookmark.findAll({ user_id: user_id });

            /**
            * TODO:find answered questions id 
            */

            let pId = []
            bookmark.forEach(element => {
                pId.push(element.post_id);
            });

            var postData = await Post.findAll({
                where: { id: { [Op.in]: pId } },
                include: [

                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "user_type"],
                        include: [
                            {
                                model: Student,
                                as: "student",
                                attributes: ["id", "name", "grad", "profile_image"],
                            },
                            {
                                model: Coach,
                                as: "coach",
                                attributes: ["id", "name", "profile_image"],
                            }
                        ],
                    },
                    {
                        model: PostFile,
                        as: "post_files",
                        attributes: ["post_file"]
                    },
                    {
                        model: PostLike,
                        as: "post_likes"
                    },
                    {
                        model: PostComment,
                        as: "post_comments",
                        attributes: ["id", "comment"],
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: ["id", "user_type"],
                                include: [
                                    {
                                        model: Student,
                                        as: "student",
                                        attributes: ["id", "name", "grad", "profile_image"],
                                    },
                                    {
                                        model: Coach,
                                        as: "coach",
                                        attributes: ["id", "name", "profile_image"],
                                    }
                                ],
                            },
                        ],
                    }, {
                        model: PostTag,
                        as: "post_tags",
                        attributes: ["id"],
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: ["id", "user_type"],
                                include: [
                                    {
                                        model: Student,
                                        as: "student",
                                        attributes: ["id", "name", "grad", "profile_image"],
                                    },
                                    {
                                        model: Coach,
                                        as: "coach",
                                        attributes: ["id", "name", "profile_image"],
                                    }
                                ],
                            },
                        ],
                    },


                ],
                offset: offset,
                limit: limit,
            });
            var data = [];

            postData.forEach(async (record) => {


                const post = {
                    id: encrypt(record.id),
                    title: record.title,
                    description: record.description,
                    created_at: record.created_at,
                    is_liked: record.is_liked,
                    post_comments_count: record.post_comments.length,
                    post_likes_count: record.post_likes.length,
                    post_tags: [],
                    post_comments: [],
                    post_files: []
                }

                //post create user details push
                post.user = record.user ? Helper.userDetails(record.user) : null;

                //comment details push
                const post_tags = record.post_tags;
                post_tags.forEach((result) => {
                    post.post_tags.push({
                        id: encrypt(result.id),
                        user: result.user ? Helper.userDetails(result.user) : null,
                    })
                });

                //comment details push
                const post_comments = record.post_comments;
                post_comments.forEach((result) => {
                    post.post_comments.push({
                        id: encrypt(result.id),
                        comment: result.comment,
                        user: result.user ? Helper.userDetails(result.user) : null,
                    })
                });


                //post files push
                const post_files = record.post_files;
                post_files.forEach((result) => {
                    post.post_files.push({
                        post_file: result.imageUrl(result.post_file)
                    })
                });

                data.push(post);
            });




            res.status(201).json(
                Helper.successResponse(data, "Success")
            );

        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };





}

// Export this module
module.exports = PostBookmarkController;
