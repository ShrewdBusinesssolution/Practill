const { Event, Student, School, EventEnrole } = require("@models");
const { encrypt, decrypt } = require("@utils/crypto");
const Helper = require("@utils/helper");
const createError = require("http-errors");
const { createEventSchema, getEventSchema, updateEventSchema, deleteEventSchema,eventEnroleSchema } = require("@validation-schemas/EventSchema");
const fs = require("fs");
const path = require("path");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');

class EventController {

    /**
     * get student event details
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static studentEvent = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const result = await getEventSchema.validateAsync(req.body);
            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;


            const student = await Student.findOne({
                where: {
                    user_id: user_id,
                }
            });

            const event = await Event.findAll({
                where: {
                    school_id: student.school_id,
                    grad: student.grad,
                },
                include: [
                    {
                        model: School,
                        as: "school",
                        attributes: ["id", "school_name"],
                    },
                ],
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit,
            });
            var data = []


            for (let index = 0; index < event.length; index++) {
                const element = event[index];

                //TODO:check login user enrole or not
                const check_enrole = await EventEnrole.findOne({
                    where: {
                        user_id: user_id,
                        event_list_id: element.id
                    },
                });
                //TODO:check login user enrole or not

                const is_enroled = check_enrole ? true : false;

                const record = {
                    id: encrypt(element.id),
                    schools: {
                        id: element.school ? encrypt(element.school.id) : '',
                        school_name: element.school ? element.school.school_name : '',
                    },
                    grad: element.grad,
                    title: element.title,
                    image: element.imageUrl(element.event_image),
                    description: element.description,
                    date: element.date,
                    is_enroled: is_enroled,

                };
                data.push(record);
            }

            res.json(Helper.successResponse(data, "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
 * get coach event details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
    static coachEvent = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const result = await getEventSchema.validateAsync(req.body);
            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;


            const event = await Event.findAll({
                where: {
                    user_id: user_id,
                },
                include: [
                    {
                        model: School,
                        as: "school",
                        attributes: ["id", "school_name"],
                    },
                ],
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit,
            });
            var data = []

            event.forEach((element) => {
                const record = {
                    id: encrypt(element.id),
                    schools: {
                        id: element.school ? encrypt(element.school.id) : '',
                        school_name: element.school ? element.school.school_name : '',
                    },
                    grad: element.grad,
                    title: element.title,
                    image: element.imageUrl(element.event_image),
                    description: element.description,
                    date: element.date,

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
         * create Event
         * @param {*} req
         * @param {*} res
         * @param {*} next
         */

    static createEvent = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const result = await createEventSchema.validateAsync(req.body);
            const school_id = decrypt(result.school_id);
            const grad = result.grad;


            const doesExist = await Event.findOne({ where: { title: result.title } });

            if (doesExist) throw createError.Conflict(`This event is already exist`);
            const event_image = req.file ? req.file.filename : '';
            const event = await Event.create({
                user_id: user_id,
                school_id: school_id,
                grad: grad,
                title: result.title,
                event_image: event_image,
                description: result.description,
                date: result.date,
            });

            if (!event) throw createError.InternalServerError();

            res.status(201).json(
                Helper.successResponse([], "Event has been registered")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
           * update Event
           * @param {*} req
           * @param {*} res
           * @param {*} next
           */
    static updateEvent = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const result = await updateEventSchema.validateAsync(req.body);
            const school_id = decrypt(result.school_id);
            const grad = result.grad;
            const event_list_id = decrypt(result.event_list_id);

            const event = await Event.findOne({
                where: {
                    id: event_list_id,
                },
            });

            if (event == null) throw createError.Conflict("Invalid Event");

            /**
            * check title already exist or not
            */
            const title = await Event.findOne({
                where: { id: { [Op.ne]: event_list_id }, title: result.title }
            });

            if (title) throw createError.Conflict("Already this event exists");

            const event_image = req.file ? req.file.filename : event.event_image;
            const update_event = await event.update({
                school_id: school_id,
                grad: grad,
                title: result.title,
                description: result.description,
                event_image: event_image,
                date: result.date,
            });

            if (!update_event) throw createError.InternalServerError();

            res.status(201).json(
                Helper.successResponse([], "Event has been updated")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };


    /**
       * delete Event  
       * @param {*} req
       * @param {*} res
       * @param {*} next
       */
    static deleteEvent = async (req, res, next) => {
        try {

            const result = await deleteEventSchema.validateAsync(req.body);
            const event_list_id = decrypt(result.event_list_id);

            const event = await Event.findOne({
                where: {
                    id: event_list_id
                },
            });

            const delete_event = await event.destroy();

            if (!delete_event) throw createError.InternalServerError();

            var file = path.join(__dirname + "./../uploads/applications/event/", event.event_image);
            fs.unlink(file, async (err) => {
            });

            res.status(201).json(
                Helper.successResponse([], "Success")
            );
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
  * enrole event
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */
    static eventEnrole = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const result = await eventEnroleSchema.validateAsync(req.body);
            const event_list_id = decrypt(result.event_list_id);

            /**
             * TODO: when enrole is true add enrole, otherwise delete enrole
             */
            if (result.enrole) {
                const checkEnrole = await EventEnrole.findOne({
                    where: {
                        user_id: user_id,
                        event_list_id: event_list_id
                    },
                });
                if (checkEnrole) throw createError.Conflict("Already enroled this event");

                var enrole = await EventEnrole.create({
                    user_id: user_id,
                    event_list_id: event_list_id,
                });
                var message = "Enroled successfull";
            }
            else {
                const checkEnrole = await EventEnrole.findOne({
                    where: {
                        user_id: user_id,
                        event_list_id: event_list_id
                    },
                });
                if (checkEnrole == null) throw createError.Conflict("Already enrole removed this event");


                const enrole = await EventEnrole.findOne({
                    where: {
                        user_id: user_id,
                        event_list_id: event_list_id
                    },
                });
                var bookmark = await enrole.destroy();
                var message = "Event enrole is removed";
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


}

// Export this module
module.exports = EventController;
