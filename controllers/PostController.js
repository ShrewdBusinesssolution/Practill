const { Post, PostComment, PostBookmark, PostLike, PostTag, PostFile, User, Student, Coach, Club, ClubJoin } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { createPostSchema, updatePostSchema, deletePostSchema, getclubPostSchema, getgeneralPostSchema, deleteTagSchema } = require("@validation-schemas/PostSchema");
const fs = require("fs");
const path = require("path");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');



class PostController {


    /**
    * store post details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static createPost = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const user = await User.findOne({
                where: {
                    id: user_id
                },
            });
            if (user == null) throw createError.Conflict("Invalid User");

            const result = await createPostSchema.validateAsync(req.body);

            const post_type = result.post_type;
            const title = result.title;
            const description = result.description;
            const tag_user = result.tag_user;
            const file_type = result.file_type;
            const school_id = decrypt(result.school_id);
            const grad = result.grad;
            const club_id = post_type == 'club' ? decrypt(result.club_id) : 0;
            var post = await Post.create({
                user_id: user_id,
                club_id: club_id,
                school_id: school_id,
                grad: grad,
                post_type: post_type,
                file_type: file_type,
                title: title,
                description: description
            });
            if (!post) throw createError.InternalServerError();

            /**
            * post a files to save
            */
            let fileKeys = req.files;
            for (const file of fileKeys) {
                var upload = PostFile.create({
                    user_id: user_id,
                    post_id: post.id,
                    post_file: file.filename,
                });
            }

            /**
            * post a taguser to save
            */
            for (const id of tag_user) {
                if (id != '') {
                    var tag = PostTag.create({
                        user_id: user_id,
                        post_id: post.id,
                        tag_user_id: decrypt(id),
                    });

                    var notification_data = {
                        user_id: decrypt(id),
                        notifiable_type: 'posts',
                        notifiable_id: post.id,
                        notifiable_user_id: user_id,
                        description: `posts you're tagged in.`,
                    };

                    const notification = await Helper.notification(notification_data);
                }
            }

            /**
            * store student activity points
            */

            if (user.user_type == 'Student') {
                var percentage_type = post_type == 'club' ? 'Club Post' : 'General Post';
                var activity_type = 'App';
                await Helper.studentActivityPoints(user_id, percentage_type, activity_type);
            }

            res.status(201).json(
                Helper.successResponse([], "Post has been upload")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
    * update post details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static updatePost = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const result = await updatePostSchema.validateAsync(req.body);

            const post_id = decrypt(result.post_id);
            const user_id = decrypt(result.user_id);


            const post = await Post.findOne({
                where: {
                    id: post_id
                },
            });

            if (post == null) throw createError.Conflict("Invalid Post");



            const title = result.title;
            const description = result.description;
            const update_post = await post.update({
                title: title,
                description: description
            });

            if (!update_post) throw createError.InternalServerError();



            /**
            * save tag this post
            */

            const tag_user = result.tag_user;
            for (const id of tag_user) {
                if (id != '') {
                    var tag = PostTag.create({
                        user_id: user_id,
                        post_id: post_id,
                        tag_user_id: decrypt(id),
                    });
                    var notification_data = {
                        user_id: decrypt(id),
                        notifiable_type: 'posts',
                        notifiable_id: post_id,
                        notifiable_user_id: user_id,
                        description: `posts you're tagged in.`,
                    };

                    const notification = await Helper.notification(notification_data);
                }
            }

            res.status(201).json(
                Helper.successResponse([], "Post has been update")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


    /**
    * delete post  
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static deletePost = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const result = await deletePostSchema.validateAsync(req.body);
            const post_id = decrypt(result.post_id);

            const post = await Post.findOne({
                where: {
                    id: post_id
                },
            });

            const delete_post = await post.destroy();

            if (!delete_post) throw createError.InternalServerError();

            /**
            * delete tag this post
            */

            const delete_tag = await PostTag.destroy({
                where: {
                    post_id: post_id
                },
            });


            /**
            * delete comment this post
            */

            const delete_comment = await PostComment.destroy({
                where: {
                    post_id: post_id
                },
            });


            /**
            * delete like this post
            */

            const delete_like = await PostLike.destroy({
                where: {
                    post_id: post_id
                },
            });

            /**
            * delete bookmark this post
            */

            const delete_bookmark = await PostBookmark.destroy({
                where: {
                    post_id: post_id
                },
            });


            /**
            * delete post files
            */

            const filesCheck = await PostFile.findAll({
                where: {
                    post_id: post_id
                },
            });

            const files = await PostFile.destroy({
                where: {
                    post_id: post_id
                },
            });

            filesCheck.forEach(async (item) => {
                var file = path.join(__dirname + "./../uploads/applications/post/", item.post_file);
                fs.unlink(file, async (err) => {

                });
            })

            res.status(201).json(
                Helper.successResponse([], "Success")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


    /**
    * club post details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static clubPostDetails = async (req, res, next) => {
        try {

            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const result = await getclubPostSchema.validateAsync(req.body);
            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;

            var student = await Student.findOne({
                where: {
                    user_id: user_id,
                }
            });

            const club_id = decrypt(result.club_id);

            var club = await Club.findOne({
                where: {
                    id: club_id,
                },
                include: [
                    {
                        model: ClubJoin,
                        as: "club_joined_users",
                    },
                    {
                        model: Post,
                        as: "posts",
                        order: [['id', 'desc']],
                        where: {
                            post_type: 'club',
                            club_id: club_id,
                            school_id: student.school_id,
                            grad: student.grad,
                        },
                        offset: offset,
                        limit: limit,
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
                                order: [
                                    ['id', 'DESC']
                                ],
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
                    }
                ],
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit,


            });

            if (!club) res.status(201).json(
                Helper.successResponse({}, "Success")
            );

            //TODO:check login user joined or not
            const check_join = await ClubJoin.findOne({
                where: {
                    user_id: user_id,
                    club_id: club.id
                },
            });

            //TODO:check login user joined or not
            const is_joined = check_join ? true : false;

            var data = {
                id: encrypt(club.id),
                club_name: club.club_name,
                club_image: club.imageUrl(club.club_image),
                club_description: club.club_description,
                color: club.color,
                joined_count: club.club_joined_users.length,
                is_joined: is_joined,
                posts: []
            }

            if (!club.posts) res.status(201).json(
                Helper.successResponse(data, "Success")
            );
            const postData = club.posts;

            for (let index = 0; index < postData.length; index++) {
                const record = postData[index];

                //TODO:check login user liked or not
                const check_like = await PostLike.findOne({
                    where: {
                        user_id: user_id,
                        post_id: record.id
                    },
                });

                //TODO:check login user bookmarked or not
                const check_bookmark = await PostBookmark.findOne({
                    where: {
                        user_id: user_id,
                        post_id: record.id
                    },
                });

                //TODO:check login user liked or not
                const is_liked = check_like ? true : false;

                //TODO:check login user bookmarked or not
                const is_bookmarked = check_bookmark ? true : false;



                const post = {
                    id: encrypt(record.id),
                    file_type: record.file_type,
                    title: record.title,
                    description: record.description,
                    created_at: record.created_at,
                    is_liked: is_liked,
                    is_bookmarked: is_bookmarked,
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
                    post.post_files.push(
                        result.imageUrl(result.post_file)
                    )
                });

                data.posts.push(post);
            }





            res.status(201).json(
                Helper.successResponse(data, "Success")
            );

        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
    * general post details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static generalPostDetails = async (req, res, next) => {

        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const result = await getgeneralPostSchema.validateAsync(req.body);
            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;
            const post_type = result.post_type;

            const student = await Student.findOne({
                where: {
                    user_id: user_id,
                }
            });

            var postData = await Post.findAll({
                where: {
                    post_type: post_type,
                    school_id: student.school_id,
                    grad: student.grad,
                },

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
                        order: [
                            ['id', 'DESC']
                        ],
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
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit

            });
            var data = [];

            for (let index = 0; index < postData.length; index++) {
                const record = postData[index];

                //TODO:check login user liked or not
                const check_like = await PostLike.findOne({
                    where: {
                        user_id: user_id,
                        post_id: record.id
                    },
                });

                //TODO:check login user bookmarked or not
                const check_bookmark = await PostBookmark.findOne({
                    where: {
                        user_id: user_id,
                        post_id: record.id
                    },
                });

                //TODO:check login user liked or not
                const is_liked = check_like ? true : false;

                //TODO:check login user bookmarked or not
                const is_bookmarked = check_bookmark ? true : false;


                const post = {
                    id: encrypt(record.id),
                    file_type: record.file_type,
                    title: record.title,
                    description: record.description,
                    created_at: record.created_at,
                    is_liked: is_liked,
                    is_bookmarked: is_bookmarked,
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
                    post.post_files.push(
                        result.imageUrl(result.post_file)
                    )
                });

                data.push(post);
            }



            res.status(201).json(
                Helper.successResponse(data, "Success")
            );

        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }

    }



    /**
    * my post details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static mypostDetails = async (req, res, next) => {
        try {

            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const limit = 10;
            const offset = 0 + (req.body.page - 1) * limit;

            var postData = await Post.findAll({
                where: {
                    user_id: user_id
                },

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
                        order: [
                            ['id', 'DESC']
                        ],
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
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit
            });
            var data = [];

            for (let index = 0; index < postData.length; index++) {
                const record = postData[index];

                //TODO:check login user liked or not
                const check_like = await PostLike.findOne({
                    where: {
                        user_id: user_id,
                        post_id: record.id
                    },
                });

                //TODO:check login user bookmarked or not
                const check_bookmark = await PostBookmark.findOne({
                    where: {
                        user_id: user_id,
                        post_id: record.id
                    },
                });

                //TODO:check login user liked or not
                const is_liked = check_like ? true : false;

                //TODO:check login user bookmarked or not
                const is_bookmarked = check_bookmark ? true : false;

                const post = {
                    id: encrypt(record.id),
                    file_type: record.file_type,
                    title: record.title,
                    description: record.description,
                    created_at: record.created_at,
                    is_liked: is_liked,
                    is_bookmarked: is_bookmarked,
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
                    post.post_files.push(
                        result.imageUrl(result.post_file)
                    )
                });

                data.push(post);
            }





            res.status(201).json(
                Helper.successResponse(data, "Success")
            );

        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


    /**
    * tag user search
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static tagUsers = async (req, res, next) => {
        try {

            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const search = req.body.search || '';
            var tag = await User.findAll({
                where: {
                    id: { [Op.ne]: user_id },
                    name: { [Op.like]: `%${search}%` }
                },
                include: [
                    {
                        model: Student,
                        as: "student",
                        attributes: ["id", "name", "profile_image"],
                    },
                    {
                        model: Coach,
                        as: "coach",
                        attributes: ["id", "name", "profile_image"],
                    }
                ],
            });


            var data = [];
            //user details push
            tag.forEach((result) => {
                var user = result ? Helper.userDetails(result) : null;
                data.push(user)
            });

            res.json(Helper.successResponse(data, "success"));
        }
        catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };
    /**
    * delete tag user 
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static deleteTagUser = async (req, res, next) => {
        try {

            const result = await deleteTagSchema.validateAsync(req.body);
            const tag_id = decrypt(result.tag_id);

            const tag = await PostTag.findOne({
                where: {
                    id: tag_id,
                },
            });

            if (tag == null) throw createError.Conflict("Invalid Tag user");


            const delete_tag = await PostTag.destroy({
                where: {
                    id: tag_id
                },
            });
            res.json(Helper.successResponse([], "success"));
        }
        catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    }

    /**
    * notification post details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static notificationPostDetails = async (req, res, next) => {
        try {

            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const post_id = decrypt(req.body.notifiable_id);

            var postData = await Post.findAll({
                where: {
                    id: post_id
                },

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
                        order: [
                            ['id', 'DESC']
                        ],
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
                order: [
                    ['id', 'DESC']
                ]
            });
            var data = [];

            for (let index = 0; index < postData.length; index++) {
                const record = postData[index];

                //TODO:check login user liked or not
                const check_like = await PostLike.findOne({
                    where: {
                        user_id: user_id,
                        post_id: record.id
                    },
                });

                //TODO:check login user bookmarked or not
                const check_bookmark = await PostBookmark.findOne({
                    where: {
                        user_id: user_id,
                        post_id: record.id
                    },
                });

                //TODO:check login user liked or not
                const is_liked = check_like ? true : false;

                //TODO:check login user bookmarked or not
                const is_bookmarked = check_bookmark ? true : false;

                const post = {
                    id: encrypt(record.id),
                    file_type: record.file_type,
                    title: record.title,
                    description: record.description,
                    created_at: record.created_at,
                    is_liked: is_liked,
                    is_bookmarked: is_bookmarked,
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
                    post.post_files.push(
                        result.imageUrl(result.post_file)
                    )
                });

                data.push(post);
            }





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
module.exports = PostController;
