const { Club, ClubJoin } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { createClubSchema, deleteClubSchema, joinClubSchema } = require("@validation-schemas/ClubSchema");
const { encrypt, decrypt } = require("@utils/crypto");

class ClubController {

    /**
     * create Club
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static createClub = async (req, res, next) => {
        try {
            const result = await createClubSchema.validateAsync(req.body);
            const doesExist = await Club.findOne({ where: { club_name: result.club_name } });

            if (doesExist) throw createError.Conflict(`This Club is already exist`);

            const club = await Club.create({
                club_name: result.club_name,
                club_description: result.club_description
            });

            if (!club) throw createError.InternalServerError();



            res.status(201).json(
                Helper.successResponse("Club has been registered")
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
    static deleteClub = async (req, res, next) => {
        try {
            const result = await deleteClubSchema.validateAsync(req.body);
            const club_id = result.club_id;

            const club = await Club.findOne({
                where: {
                    id: club_id,
                },
            });

            if (!club) throw createError.Conflict("Provide valid club details");

            const delete_club = await club.destroy();
            if (!club) throw createError.InternalServerError("Something went wrong!");

            res.json(Helper.successResponse("", "Club deleted succefully!"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }


    }

    /**
 * club details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
    static clubDetails = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const clubData = await Club.findAll({
                where: {
                    status: 1,
                },
            });

            var data = [];


            for (let index = 0; index < clubData.length; index++) {
                const record = clubData[index];

                //TODO:check login user joined or not
                const check_join = await ClubJoin.findOne({
                    where: {
                        user_id: user_id,
                        club_id: record.id
                    },
                });

                //TODO:check login user joined or not
                const is_joined = check_join ? true : false;
           
                data.push({
                    id: encrypt(record.id),
                    club_name: record.club_name,
                    club_image: record.imageUrl(record.club_image),
                    club_description: record.club_description,
                    color: record.color,
                    is_joined: is_joined
                });
            }

            res.json(Helper.successResponse(data, "success"));

        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
   * join Club
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
    static joinClub = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const result = await joinClubSchema.validateAsync(req.body);
            const join = result.join;
            const club_id = decrypt(result.club_id)
            const doesExist = await Club.findOne({ where: { id: club_id, status: 0, } });

            if (doesExist) throw createError.Conflict(`Invalid Club`);

            if (join) {

                const checkJoin = await ClubJoin.findOne({
                    where: {
                        user_id: user_id,
                        club_id: club_id
                    },
                });

                if (checkJoin) throw createError.Conflict("Already joined");

                const club = await ClubJoin.create({
                    user_id: user_id,
                    club_id: club_id
                });

                if (!club) throw createError.InternalServerError();
                var message = "Thanks for joining the club";
            }
            else
            {
                const clubjoin = await ClubJoin.findOne({
                    where: {
                        user_id: user_id,
                        club_id: club_id
                    },
                });

                if (!clubjoin) throw createError.Conflict("Already removed");

                const delete_join = await clubjoin.destroy();
                var message = "Removed the club";

            }

            res.status(201).json(
                Helper.successResponse([], message)
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
 * my club list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
    static myClubs = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const clubData = await ClubJoin.findAll({
                where: {
                    user_id: user_id,
                },
                include: [
                    {
                        model: Club,
                        where: { status: 1 },
                        as: "clubs"
                    },
                ]
            });

            var data = [];

            clubData.forEach((record) => {
                data.push({
                    id: encrypt(record.clubs.id),
                    club_name: record.clubs.club_name,
                    club_image: record.clubs.imageUrl(record.clubs.club_image),
                    club_description: record.clubs.club_description,
                    color: record.clubs.color
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
module.exports = ClubController;
