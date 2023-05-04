const { User, CoachSchool, Coach, CoachType, School, Student } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const JwtHelper = require("@utils/jwt");
const DateTimeHelper = require("@utils/date_time_helper");
const { encrypt, decrypt } = require("@utils/crypto");
const { createCoachSchema, updateCoachSchema, deleteCoachSchema, getCoachIdSchema, getStudentSchema } = require("@validation-schemas/CoachSchema");
const AuthController = require("@controllers/AuthController");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
class CoachController {
    
    /**
    * createCoach
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static createCoach = async (req, res, next) => {
        try {
            const result = await createCoachSchema.validateAsync(req.body);
            
            const doesExist = await User.findOne({
                where: {
                    [Op.or]: [{ mobile_number: result.mobile_number }, { email: result.email }]
                }
             });

            if (doesExist) throw createError.Conflict(`This Mobile Number or Email id is already exist`);
            
            const user = await User.create({
                name: result.name,
                user_type: 'Coach',
                mobile_number: parseInt(result.mobile_number),
                password: await Helper.hashPassword(result.password)
            });

            const coach = await Coach.create({
                coach_id: result.coach_id,
                user_id: user.id,
                name: result.name,
                coach_type_id: decrypt(result.coach_type_id),
                mobile_number: parseInt(result.mobile_number),
                email: result.email
            });
            
            if (!coach) throw createError.InternalServerError();
            
         
            res.status(201).json(
                Helper.successResponse(await AuthController.generateUserTokens(user.id), "Coach has been registered")
                );
            } catch (error) {
                if (error.isJoi == true) error.status = 422;
                next(error);
            }
    };
    


    /**
    * update coach
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static updateCoach = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const result = await updateCoachSchema.validateAsync(req.body);


            const user = await User.findOne({
                where: {
                    id: user_id,
                },
            });

            if (user == null) throw createError.Conflict("Invalid User");

            const coach = await Coach.findOne({
                where: {
                    user_id: user_id,
                },
            });

            if (coach == null) throw createError.Conflict("Invalid User");

            /**
            * check mobile number already exist or not
            */
            const mobile = await User.findOne({
                where: { id: { [Op.ne]: user_id }, mobile_number: parseInt(result.mobile_number) }
            });

            if (mobile) throw createError.Conflict("Already this mobile number exists");

            const update_user = await user.update({
                name: result.name,
                email: result.email,
                mobile_number: parseInt(result.mobile_number),
            });

            const profile_image = req.file ? req.file.filename : null;
            const update_coach = await coach.update({
                coach_id: result.coach_id,
                user_id: user.id,
                name: result.name,
                mobile_number: parseInt(result.mobile_number),
                email: result.email,
                profile_image: profile_image
            });

            if (!update_coach) throw createError.InternalServerError();

            res.status(201).json(
                Helper.successResponse([], "Profile has been updated")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

        
        /**
        * deleteClub
        * @param {*} req
        * @param {*} res
        * @param {*} next
        */
        static deleteCoach = async (req, res, next) => {
            try {
                const result = await deleteCoachSchema.validateAsync(req.body);
                const coach_id = result.coach_id;
                
                const coach = await Coach.findOne({
                    where: {
                        coach_id: coach_id,
                    },
                });
                
                if (!coach) throw createError.Conflict("Provide valid Coach details");
                
                const delete_coach = await coach.destroy();
                if (!delete_coach) throw createError.InternalServerError("Something went wrong!");
                
                const user = await User.findOne({
                    where: {
                        login_id: coach_id,
                    },
                    where: {
                        login_type: "Coach",
                    },
                });
                const delete_user = await user.bulkDelete();
                res.json(Helper.successResponse("", "Coach deleted succefully!"));
            } catch (error) {
                if (error.isJoi == true) error.status = 422;
                next(error);
            }
            
            
        }
        
        /**
        * coach profile
        * @param {*} req
        * @param {*} res
        * @param {*} next
        */
        static profile = async (req, res, next) => {
            try {
                const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
                const user_id = decrypt(token_info.audience);
                const coach = await Coach.findOne({
                    where: {
                        user_id: user_id,
                    },
                    include: [
                        {
                            model: CoachType,
                            as: "coach_type",
                        },
                    ],
                    
                });
                if (coach == null) throw createError.Conflict("Invalid User");
                var profile = {
                    user_id: encrypt(coach.id),
                    coach_id: coach.coach_id,
                    coach_type_details:
                    {
                        id: coach.coach_type ? encrypt(coach.coach_type.id):'',
                        coach_type: coach.coach_type ? coach.coach_type.coach_type : ''
                    },
                    name: coach.name,
                    email: coach.email,
                    mobile_number: coach.mobile_number,
                    profile_image: coach.profile_image == null ? "https://ui-avatars.com/api/?background=74A02F&color=fff&name=" + coach.name : coach.imageUrl(coach.profile_image),
                };
                
                res.status(201).json(
                    Helper.successResponse(profile, "Success")
                    );
                } catch (error) {
                    if (error.isJoi == true) error.status = 422;
                    next(error);
                }
            }
            
            /**
            * get coach type
            * @param {*} req
            * @param {*} res
            * @param {*} next
            */
            static coachType = async (req, res, next) => {
                try {
                    const type = await CoachType.findAll();
                    var data = []
                    
                    type.forEach((element) => {
                        const record = {
                            id: encrypt(element.id),
                            title: element.coach_type,
                        };
                        data.push(record);
                    });
                    
                    res.json(Helper.successResponse(data, "success"));
                } catch (error) {
                    if (error.isJoi == true) error.status = 422;
                    next(error);
                }
            };
            
            /**
            * get coach schools
            * @param {*} req
            * @param {*} res
            * @param {*} next
            */
            static coachSchools = async (req, res, next) => {
                try {
                    const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
                    const user_id = decrypt(token_info.audience);
                    const coachSchool = await CoachSchool.findAll(
                        {
                            where: {
                                user_id: user_id
                            },
                            include: [
                                {
                                    model: School,
                                    as: "school"
                                }
                            ],
                        }
                        );
                        var data = []
                        
                        coachSchool.forEach((element) => {
                            const record = {
                                id: element.school ? encrypt(element.school.id):"",
                                school_name: element.school ? element.school.school_name:"",
                            };
                            data.push(record);
                        });
                        
                        res.json(Helper.successResponse(data, "success"));
                    } catch (error) {
                        if (error.isJoi == true) error.status = 422;
                        next(error);
                    }
    };

    /**
      * get coach students
      * @param {*} req
      * @param {*} res
      * @param {*} next
      */
    static coachStudents = async (req, res, next) => {
        try {

            const result = await getStudentSchema.validateAsync(req.body);
            const school_id = decrypt(result.school_id);
            const grad = result.grad;


            const coachStudent = await Student.findAll(
                {
                    where: {
                        school_id: school_id,
                        grad: grad
                    }
                }
            );
            var data = []

            coachStudent.forEach((element) => {
                const record = {
                    user_id: encrypt(element.user_id),
                    name: element.name,
                    profile_image: element.profile_image == null ? "https://ui-avatars.com/api/?background=74A02F&color=fff&name=" + element.name : element.imageUrl(element.profile_image),
                };
                data.push(record);
            });

            res.json(Helper.successResponse(data, "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    

    /**
        * get coach id
        * @param {*} req
        * @param {*} res
        * @param {*} next
        */
    static coachId = async (req, res, next) => {
        try {

            const result = await getCoachIdSchema.validateAsync(req.body);
            const coach_type_id = decrypt(result.coach_type_id);
            const coach_type = await CoachType.findOne({
                where: {
                    id: coach_type_id
                }
            });

            if (!coach_type) throw createError.Conflict("Provide valid coach type details");

            const year = DateTimeHelper.currentYear();
            const prefix = coach_type.prefix_type;

            const coach = await Coach.findOne({
                where: {
                    [Op.and]: sequelize.where(sequelize.fn('YEAR', sequelize.col('created_at')), 2023)   
                },
                order: [
                    ['id', 'DESC'],
                ],
            });
            
            if (!coach) {
                var coach_id = prefix + year + '0001';
            }
            else {
                var previous_coach_id = coach.coach_id;
                var findId = previous_coach_id.substring(previous_coach_id.indexOf("-")+1);
                var increment = parseInt(findId) + 1;
                var digit = Helper.findDigit(increment);
                var coach_id = prefix + year +'-'+ digit;
            }

            var data = {
                coach_id: coach_id
            }

            res.json(Helper.successResponse(data, "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };
                
            }
            
            // Export this module
            module.exports = CoachController;
            