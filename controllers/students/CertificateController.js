const { Certificate, StudentCertificate } = require("@models");
const createError = require("http-errors");
const Helper = require("@utils/helper");
const { encrypt, decrypt } = require("@utils/crypto");
class CertificateController {

  

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
                    id: encrypt(record.certificates.id),
                    title: record.certificates.title,
                    certificate_image: record.certificates.imageUrl(record.certificates.certificate_image),
                    description: record.certificates.description,
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
