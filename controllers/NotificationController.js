const { Notification, User, Student,Coach } = require("@models");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
const moment = require("moment");
class NotificationController {
    
    /**
    * get notification details
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static notificationDetails = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const notifictaion = await Notification.findAll({
                where: {
                    user_id: user_id,
                    // [Op.and]: [
                    //     sequelize.where(sequelize.fn('MONTH', sequelize.col('created_at')), result.month),
                    //     sequelize.where(sequelize.fn('YEAR', sequelize.col('created_at')), result.year),
                    // ],
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
                ]
            });
            var data = {
                today: [],
                yesterday: [],
                this_month:[]
            }
            notifictaion.forEach((element) => {
                const record = {
                    user: element.user ? Helper.userDetails(element.user) : null,
                    notifiable_type: element.notifiable_type,
                    notifiable_id: encrypt(element.notifiable_id),
                    description: element.description,
                    created_at: element.created_at
                    
                };
                if (DateTimeHelper.currentDate() == DateTimeHelper.convertDateFormat(element.created_at))
                {
                    data.today.push(record);  
                } else if(DateTimeHelper.yesterDayDate() == DateTimeHelper.convertDateFormat(element.created_at))
                {
                    data.yesterday.push(record);  

                } else
                {
                    data.this_month.push(record);
                }
                
            });
            
            res.json(Helper.successResponse(data, "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };
    
    
}

// Export this module
module.exports = NotificationController;
