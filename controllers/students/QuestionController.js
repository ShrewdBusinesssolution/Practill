const { User,Game,Level,Question,Clue, StudentAnswer } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const DateTimeHelper = require("@utils/date_time_helper");
const { studentAnswerSchema } = require("@validation-schemas/QuestionSchema");
const Op = require('sequelize').Op;
class QuestionController {
    
    /**
    * Question game
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static questions = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            const answered_questions = await StudentAnswer.findAll({ where: { user_id: user_id } });
            console.log(answered_questions);
            /**
            * TODO:find answered questions id 
            */
            
            let aId = []
            answered_questions.forEach(element => {
                aId.push(element.question_id );
            }); 
            console.log(aId);
            const question = await Question.findOne({
                where: { id: { [Op.notIn]: aId } },
                include: [
                    {
                        model: Game,
                        as: "game",
                        attributes: ["id", "title"]
                    },
                    
                    {
                        model: Level,
                        as: "level",
                        attributes: ["id", "level_type"]
                    },
                    {
                        model: Clue,
                        as: "clues",
                        attributes: ["id","clue"]
                    },
                ],
                order: [
                    ['level_id', 'ASC'],
                ],
                attributes: ["id","question"]
            });
            const level_id = question.level.id;
            
            
            
            
            /**
            * calculate level percentage
            */
            const totalLevelAnswered = await StudentAnswer.count({ where: { user_id: user_id, level_id: level_id } });
            const totalLevelQuestion = await Question.count({ where: { level_id: level_id } });
            const calc_percentage = 100 / totalLevelQuestion;
            const level_percentage_value = (totalLevelAnswered + 1)* calc_percentage;
            const level_percentage = level_percentage_value.toFixed(2);



            /**
            * calculate game complete or not
            */
            const totalAnswered = await StudentAnswer.count({ where: { user_id: user_id} });
            const totalQuestion = await Question.count();
            const is_completed = totalQuestion == totalAnswered ? true : false;
            
            const data = {
                id: encrypt(question.id),
                question: question.question,
                level_percentage: level_percentage,
                is_completed: is_completed,
                level: {
                    id: question.level ? encrypt(question.level.id):'',
                    level_type: question.level ? question.level.level_type:'',
                },
                clues:[],
                game: {
                    id: encrypt(question.game.id),
                    title: question.game.title,
                }
            }
            question.clues.forEach((result) => {
                data.clues.push({
                    id: encrypt(result.id),
                    clue: result.clue
                })
            });
            res.json(Helper.successResponse(data, "success"));
        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };
    
    /**
    * answer
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    static storeStudentAnswer = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);
            
            const result = await studentAnswerSchema.validateAsync(req.body);
            
            const game_id = decrypt(result.game_id);
            const level_id = decrypt(result.level_id);
            const question_id = decrypt(result.question_id);
            
            const doesExist = await StudentAnswer.findOne({ where: { user_id: user_id, game_id: game_id, level_id: level_id, question_id: question_id } });
            if (doesExist) throw createError.Conflict(`You already answer this question`);
            
            
            const questionCheck = await Question.findOne({ where: { id: question_id } });
            if (!questionCheck) throw createError.Conflict(`Invalid question`);
            
            const answerCheck = await Question.findOne({ where: { id: question_id, answer: result.answer } });
            
            const is_correct = answerCheck ? 1 : 0;
            const message = answerCheck ? 'Yaass! You’re Right' : 'Oh no! That’s Wrong';
            const answer = await StudentAnswer.create({
                user_id: user_id,
                game_id: game_id,
                level_id: level_id,
                question_id: question_id,
                answer: result.answer,
                is_correct: is_correct,
            });
            
            if (!answer) throw createError.InternalServerError();
            
            /**
            * store student points
            */
            var percentage_type = 'Game';
            var activity_type = 'App';
            await Helper.studentActivityPoints(user_id, percentage_type, activity_type);
            
            res.status(201).json(
                Helper.successResponse(questionCheck.answer, message)
                );
            } catch (error) {
                if (error.isJoi == true) error.status = 422;
                next(error);
            }
        };
        
        
        
        
        
    }
    
    // Export this module
    module.exports = QuestionController;
    