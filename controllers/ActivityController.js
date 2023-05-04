const { Post, PostComment, PostLike, PostTag, PostFile, User, Student, Coach, StudentAnswer,Question } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { studentActivitySchema, clubActivitySchema } = require("@validation-schemas/PostSchema");
const {gameActivitySchema } = require("@validation-schemas/QuestionSchema");

const Op = require('sequelize').Op;
const sequelize = require('sequelize');



class ActivityController {




    /**
    * student general post details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static studentActivity = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const result = await studentActivitySchema.validateAsync(req.body);
            const user_id = result.user_id!='' ? decrypt(result.user_id):'';
            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;

            /**
           * when filter type is all not use where condition get all data
           * when filter type is individual then use where condition get filtered data
           */
            const where = result.filter_type != 'all' ? {
                user_id: user_id
            }:{}
            where['post_type'] = 'general';
            var postData = await Post.findAll({
                where,
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
                order: [
                    ['id', 'DESC']
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




    /**
    * student club post details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static clubActivity = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const result = await clubActivitySchema.validateAsync(req.body);
            const user_id = result.user_id != '' ? decrypt(result.user_id) : '';
            const club_id = result.club_id != '' ? decrypt(result.club_id) : '';

            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;

            /**
           * when filter type is all not use where condition get all data
           * when filter type is individual then use where condition get filtered data
           */
            let where = result.filter_type != 'all' ? {
                user_id: user_id,
                club_id: club_id
            } : {}

            where['post_type'] = 'club';

            var postData = await Post.findAll({
                where,
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
                order: [
                    ['id', 'DESC']
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


    /**
  * student game activity
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */
    static gameActivity = async (req, res, next) => {
        try {

            const result = await gameActivitySchema.validateAsync(req.body);
            const school_id = decrypt(result.school_id);
            const grad = result.grad;
            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;


            const student = await Student.findAll(
                {
                    where: {
                        school_id: school_id,
                        grad: grad
                    },
                   

                    order: [
                        ['id', 'DESC']
                    ],
                    offset: offset,
                    limit: limit,
                }
            );
            var data = []

            student.forEach(async (element) => {
                
                /**
              * check student game level 
              */
                // const findLevel = await StudentAnswer.findOne({ where: { user_id: element.user_id} });
                // if (findLevel) {

                    // const totalLevelQuestion = await Question.count({ where: { level_id: findLevel.level_id } });
                    // const totalCorrectAnswered = await StudentAnswer.count({ where: { user_id: element.user_id, level_id: findLevel.level_id,is_correct:1 } });
                    // const totalWrongAnswered = await StudentAnswer.count({ where: { user_id: element.user_id, level_id: findLevel.level_id, is_correct: 0 } });
                    const record = {
                        user_id: encrypt(element.user_id),
                        name: element.name,
                        profile_image: element.profile_image == null ? "https://ui-avatars.com/api/?background=74A02F&color=fff&name=" + element.name : element.imageUrl(element.profile_image),
                        total_level_question: "totalLevelQuestion",
                        total_correct_answer: "totalCorrectAnswered",
                        total_wrong_answer: "totalWrongAnswered",

                    };
                    data.push(record);
                // }
            });

            res.json(Helper.successResponse(data, "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };




}




// Export this module
module.exports = ActivityController;
