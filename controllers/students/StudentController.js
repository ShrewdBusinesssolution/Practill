const { User, Student, StudentInterest, School, StudentActivity, StudentCertificate, Certificate } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { createStudentSchema, updateStudentSchema, getActivitySchema } = require("@validation-schemas/StudentSchema");
const AuthController = require("@controllers/AuthController");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
class StudentController {
    
    /**
    * createStudent
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static createStudent = async (req, res, next) => {
        try {
            const result = await createStudentSchema.validateAsync(req.body);
            
            const doesExist = await User.findOne({ where: { mobile_number: result.mobile_number } });
            
            if (doesExist) throw createError.Conflict(`This Mobile Number is already exist`);
            const user = await User.create({
                name: result.name,
                user_type: 'Student',
                mobile_number: parseInt(result.mobile_number),
                password: await Helper.hashPassword(result.password)
            });
            
            const school_id = decrypt(result.school_id);
            const student = await Student.create({
                name: result.name,
                user_id: user.id,
                mobile_number: parseInt(result.mobile_number),
                grad: result.grad,
                school_id: school_id,
                school_name: result.school_name
            });
            
            if (!student) throw createError.InternalServerError();
            
            
            
            res.status(201).json(
                Helper.successResponse(await AuthController.generateUserTokens(user.id), "Student has been registered")
                );
            } catch (error) {
                if (error.isJoi == true) error.status = 422;
                next(error);
            }
        };
        
        
        /**
        * student interest
        * @param {*} req
        * @param {*} res
        * @param {*} next
        */
        static storeStudentInterest = async (req, res, next) => {
            try {
                const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
                const user_id = decrypt(token_info.audience);
                
                const interest_id = req.body.interest_id;
                var flag = false;
                interest_id.forEach(function (id) {
                    var interest = StudentInterest.create({
                        user_id: user_id,
                        interest_id: decrypt(id),
                    });
                    flag = true;
                });
                
                if (!flag) throw createError.InternalServerError();
                
                res.status(201).json(
                    Helper.successResponse([], "Interest has been stored")
                    );
                } catch (error) {
                    if (error.isJoi == true) error.status = 422;
                    next(error);
                }
            };
            
            
            /**
            * update student
            * @param {*} req
            * @param {*} res
            * @param {*} next
            */
            static updateStudent = async (req, res, next) => {
                try {
                    const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
                    const user_id = decrypt(token_info.audience);
                    const result = await updateStudentSchema.validateAsync(req.body);
                    
                    
                    const user = await User.findOne({
                        where: {
                            id: user_id,
                        },
                    });
                    
                    if (user == null) throw createError.Conflict("Invalid User");
                    
                    const student = await Student.findOne({
                        where: {
                            user_id: user_id,
                        },
                    });
                    
                    if (student == null) throw createError.Conflict("Invalid User");
                    
                    /**
                    * check mobile number already exist or not
                    */
                    const mobile = await User.findOne({
                        where: { id: { [Op.ne]: user_id }, mobile_number: parseInt(result.mobile_number) }
                    });
                    
                    if (mobile) throw createError.Conflict("Already this mobile number exists");
                    
                    const update_user = await user.update({
                        name: result.name,
                        mobile_number: parseInt(result.mobile_number),
                    });
                    
                    const profile_image = req.file ? req.file.filename : null;
                    const school_id = decrypt(result.school_id);
                    const update_student = await student.update({
                        name: result.name,
                        user_id: user.id,
                        mobile_number: parseInt(result.mobile_number),
                        grad: result.grad,
                        school_id: school_id,
                        school_name: result.school_name,
                        profile_image: profile_image
                    });
                    
                    if (!update_student) throw createError.InternalServerError();
                    
                    res.status(201).json(
                        Helper.successResponse([], "Profile has been updated")
                        );
                    } catch (error) {
                        if (error.isJoi == true) error.status = 422;
                        next(error);
                    }
                };
                
                /**
                * student profile
                * @param {*} req
                * @param {*} res
                * @param {*} next
                */
                static profile = async (req, res, next) => {
                    try {
                        const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
                        const user_id = decrypt(token_info.audience);
                        const student = await Student.findOne({
                            where: {
                                user_id: user_id,
                            },
                            include: [
                                {
                                    model: School,
                                    as: "schools",
                                    attributes: ["id","school_name"],
                                },
                            ],
                        });
                        if (student == null) throw createError.Conflict("Invalid User");
                        var profile = {
                            user_id: encrypt(student.id),
                            name: student.name,
                            mobile_number: student.mobile_number,
                            school_name: student.school_name,
                            schools: {
                                id: student.schools ? encrypt(student.schools.id):'',
                                school_name: student.schools ? student.schools.school_name:'',
                            },
                            grad: student.grad,
                            level: student.level,
                            reward_points: student.reward_points,
                            profile_image: student.profile_image == null ? "https://ui-avatars.com/api/?background=74A02F&color=fff&name=" + student.name : student.imageUrl(student.profile_image),
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
                    * student activity
                    * @param {*} req
                    * @param {*} res
                    * @param {*} next
                    */
                    static myActivity = async (req, res, next) => {
                        try {
                            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
                            const user_id = decrypt(token_info.audience);
                            const result = await getActivitySchema.validateAsync(req.body);
                            /**
                            * month wise activity filter
                            */
                            const app_activity = await StudentActivity.findAll({
                                where: {
                                    user_id: user_id,
                                    activity_type: 'App',
                                    [Op.and]: [
                                        sequelize.where(sequelize.fn('MONTH', sequelize.col('created_at')), result.month),
                                        sequelize.where(sequelize.fn('YEAR', sequelize.col('created_at')), result.year),
                                        
                                    ],
                                    
                                },
                                attributes: [[
                                    sequelize.fn("sum", sequelize.col("percentage")), "value",
                                ]],
                                raw: true,
                                
                            });
                            
                            const class_activity = await StudentActivity.findAll({
                                where: {
                                    user_id: user_id,
                                    activity_type: 'Class',
                                    [Op.and]: [
                                        sequelize.where(sequelize.fn('MONTH', sequelize.col('created_at')), result.month),
                                        sequelize.where(sequelize.fn('YEAR', sequelize.col('created_at')), result.year),
                                    ],
                                    
                                },
                                attributes: [[
                                    sequelize.fn("sum", sequelize.col("percentage")), "value",
                                ]],
                                raw: true,
                                
                            });
                            
                            
                            var data = {
                                app_activity: app_activity[0].value ? app_activity[0].value:0,
                                class_activity: class_activity[0].value ? class_activity[0].value:0,
                            };
                            
                            res.status(201).json(
                                Helper.successResponse(data, "Success")
                                );
                            } catch (error) {
                                if (error.isJoi == true) error.status = 422;
                                next(error);
                            }
    }
    

    /**
* my certificate list
* @param {*} req
* @param {*} res
* @param {*} next
*/
    static myCertificates = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const certificate = await StudentCertificate.findAll({
                where: {
                    user_id: user_id,
                },
                include: [
                    {
                        model: Certificate,
                        as: "certificates"
                    },
                ]
            });

            var data = [];

            certificate.forEach((record) => {
                data.push({
                    id: record.certificates ? encrypt(record.certificates.id):'',
                    title: record.certificates ? record.certificates.title:'',
                    certificate_image: record.certificates ? record.certificates.imageUrl(record.certificates.certificate_image):'',
                    description: record.certificates ? record.certificates.description:'',
                });
            });

            res.json(Helper.successResponse(data, "success"));

        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };
                    }
                    
                    // Export this module
                    module.exports = StudentController;
                    