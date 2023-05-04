const { Event } = require("@models");
const { encrypt, decrypt } = require("@utils/crypto");
const Helper = require("@utils/helper");
const createError = require("http-errors");
const { createEventSchema, getEventSchema, updateEventSchema, deleteEventSchema } = require("@validation-schemas/EventSchema");
const fs = require("fs");
const path = require("path");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');

class EventController {

    /**
     * get onboarding details
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static index = async (req, res, next) => {
        try {
            const result = await getEventSchema.validateAsync(req.body);
     
            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;

            const event = await Event.findAll({
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit,
            });
            var data = []

            event.forEach((element) => {
                const record = {
                    id:encrypt(element.id),
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
            const result = await createEventSchema.validateAsync(req.body);

            const doesExist = await Event.findOne({ where: { title: result.title } });

            if (doesExist) throw createError.Conflict(`This event is already exist`);
            const event_image = req.file ? req.file.filename : '';
            const event = await Event.create({
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

            const result = await updateEventSchema.validateAsync(req.body);
            const event_id = decrypt(result.event_id);

            const event = await Event.findOne({
                where: {
                    id: event_id,
                },
            });

            if (event == null) throw createError.Conflict("Invalid Event");

            /**
            * check title already exist or not
            */
            const title = await Event.findOne({
                where: { id: { [Op.ne]: event_id }, title: result.title }
            });

            if (title) throw createError.Conflict("Already this event exists");

            const event_image = req.file ? req.file.filename : event.event_image;
            const update_event = await event.update({
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
            const event_id = decrypt(result.event_id);

            const event = await Event.findOne({
                where: {
                    id: event_id
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


}

// Export this module
module.exports = EventController;
