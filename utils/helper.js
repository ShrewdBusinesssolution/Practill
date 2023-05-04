const bcrypt = require("bcrypt");
const { StudentActivity, Student, Notification } = require("@models");
var rn = require("random-number");
const JwtHelper = require("@utils/jwt");
const createError = require("http-errors");
const { encrypt, decrypt } = require("@utils/crypto");
require('dotenv').config();
class Helper {



    

    /**
     * get user details
     * @param {*} user
     *  @returns
     */

    static userDetails =  (user) => {
            const user_type = user.user_type;
        const selectUser = user_type == 'Student' ? user.student : (user_type == 'Coach' ? user.coach : user.admin);
            var user_details = {
                user_id: encrypt(user.id),
                user_type: user.user_type,
                name: selectUser.name,
                grad: selectUser.grad ? selectUser.grad : '',
                profile_image: selectUser.profile_image == null ? "https://ui-avatars.com/api/?background=74A02F&color=fff&name=" + selectUser.name: selectUser.imageUrl(selectUser.profile_image),
            };
        
        return user_details;
    }



    /**
     * hashPassword
     * @param {*} originalData
     * @returns
     */

    static hashPassword = async (originalData) => {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedData = bcrypt.hashSync(originalData.toString(), salt);

        return encryptedData;
    };

    /**
     * verifyPassword
     * @param {*} original_password
     * @param {*} encrypted_password
     * @returns
     */
    static verifyPassword = async (original_password, encrypted_password) => {
        return await bcrypt.compare(original_password.toString(), encrypted_password);
    };

    /**
     * getBearerToken
     * @param {*} requestHeader
     * @returns
     */
    static getBearerToken = async (requestHeader) => {
        const bearerToken = requestHeader.split(" ");
        const token = bearerToken[1];

        return await token;
    };

    /**
     * successResponse
     * @param {*} dataObject
     * @param {*} message
     * @returns
     */
    static successResponse = (dataObject, message) => {
        return { status: true, message: message, data: dataObject };
    };

    /**
     * generateOtp
     * @returns six digit number
     */

    static generateOtp = () => {
        return 1234;
        return this.randomNumber(100000, 999999);
    };

    /**
   * degit set
   * @returns number
   */

    static findDigit = (id) => {
       const length=id.toString().length;
        if (length == 1)
           {
         var   data = '00' + id;
        }
        else if (length == 2)
        {
            var  data = '0' + id;
        }
        else
        {
            var  data = id;
        }
        return data;
       
    };

    /**
     * randomNumber
     * @param {*} min
     * @param {*} max
     */
    static randomNumber = (min, max) => {
        var options = {
            min: min,
            max: max,
            integer: true,
        };
        return rn(options);
    };

    /**
     * tokenInfo
     * @param {*} requestHeader
     * @returns
     */
    static tokenInfo = async (requestHeader) => {
        const bearerToken = requestHeader.split(" ");
        const token = bearerToken[1];
        const token_info = await JwtHelper.getTokenInfo(token);
        return await token_info;
    };

    

    /**
     * save percentage and rewards
     * @param {*} 
     *  @returns
     */

    static studentActivityPoints = async (user_id, percentage_type, activity_type) => {
        /**
         * calculate and store percentage and points
         */
        
        let percentage;
        let reward_points;
        switch (percentage_type) {
            case "Club Post":
                percentage = 0.25;
                reward_points = 0.25;
                break;
            case "General Post":
                percentage = 0.25;
                reward_points = 0.25;
                break;
            case "Game":
                percentage = 0.50;
                reward_points = 0.50;
                break;
            case "Certificate":
                percentage = 0.25;
                reward_points = 0.25;
                break;
            default:
                percentage = 0.25;
                reward_points = 0.25;
        }

        var post = await StudentActivity.create({
            user_id: user_id,
            activity_type: activity_type,
            percentage_type: percentage_type,
            percentage: percentage,
            reward_points: reward_points
        });

        const user = await Student.findOne({
            where: {
                user_id: user_id
            },
        });

        if (user) {
            const update_post = await user.update({
                reward_points: reward_points
            });
        }

    }


    /**
     * notification
     * @param {*} data
     * @returns
     */
    static notification = async (data) => {
        const save_notification = await Notification.create(data);
    };
    

  
}

// Export this module
module.exports = Helper;
