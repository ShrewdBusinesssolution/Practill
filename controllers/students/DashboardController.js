const { User, Student, School, StudentDashboard, StudentDashboardActivity } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
class DashboardController {
    
    /**
    * Dashboard Details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static dashboardDetails = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const user = await User.findOne({
                where: {
                    id: user_id,
                },
                include: [
                    {
                        model: Student,
                        as: "student",
                        include: [
                            {
                                model: School,
                                as: "schools",
                                attributes: ["school_name"],
                            },
                        ],
                        attributes: ["profile_image","mobile_number", "name","grad","school_name"],
                    },
                ],
            });
            if (user == null) throw createError.Conflict("Invalid User");
            const dashboardDetails = await StudentDashboard.findOne({
                order: [
                    ['id', 'DESC'],
                ],
            });
            
            if (dashboardDetails == null) throw createError.Conflict("Invalid Description");

            user.student.profile_image = user.student.profile_image == null ? "https://ui-avatars.com/api/?background=74A02F&color=fff&name=" + user.student.name : selectUser.imageUrl(user.student.profile_image);
           
            var data = {
                profile_details: user.student,
                description: dashboardDetails.description,
                acitivity: [],
                
            };
            
            const dashboardActivity = await StudentDashboardActivity.findAll({});
            
            dashboardActivity.forEach((record) => {
                data.acitivity.push({
                    title: record.title,
                    image: record.imageUrl(record.image),
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
module.exports = DashboardController;
