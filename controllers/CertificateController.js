const { Certificate, StudentCertificate } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
const { studentCertificateSchema } = require("@validation-schemas/StudentSchema");

class CertificateController {

    /**
 * certificate list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
    static index = async (req, res, next) => {
        try {
            const token_info = await Helper.tokenInfo(req.headers["authorization"]); // Get token through helper funtion
            const user_id = decrypt(token_info.audience);

            const certificate = await Certificate.findAll({

            });

            var data = [];

            certificate.forEach((record) => {
                data.push({
                    id: encrypt(record.id),
                    title: record.title,
                    certificate_image: record.imageUrl(record.certificate_image),
                    description: record.description,
                });
            });

            res.json(Helper.successResponse(data, "success"));

        } catch (error) {
            if (error.isJoi == true) error.status = 422;
            next(error);
        }
    };

    /**
 * student certificate list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
    static studentCertificates = async (req, res, next) => {
        try {

            const result = await studentCertificateSchema.validateAsync(req.body);
            const user_id = result.user_id != '' ? decrypt(result.user_id) : '';
            const certificate_id = result.certificate_id!='all' && result.certificate_id != '' ? decrypt(result.certificate_id) : '';

            const limit = 10;
            const offset = 0 + (result.page - 1) * limit;


            /**
         * when filter type is all not use where condition get all data
         * when filter type is individual then use where condition get filtered data
         */
            let where = result.filter_type != 'all' ? {
                user_id: user_id,
            } : {}

            if (result.filter_type != 'all')
            {
                result.certificate_id != 'all' ? where['certificate_id'] = certificate_id : '';

                }


            const certificate = await StudentCertificate.findAll({
                where,
                include: [
                    {
                        model: Certificate,
                        as: "certificates"
                    },
                ],
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit,
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
module.exports = CertificateController;
