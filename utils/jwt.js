const JWT = require("jsonwebtoken");
const createError = require("http-errors");

class JwtHelper {
    /**
     * signAccessToken
     * @param {*} userId
     * @param {*} subject
     * @returns
     */
    static signAccessToken = async (userId, subject) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "2d",
                issuer: "practills",
                audience: userId,
                subject: subject,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log("Access Token Error" + err);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    };

    /**
     * signRefreshToken
     * @param {*} userId
     * @returns
     */
    static signRefreshToken = async (userId, subject) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: "30d",
                issuer: "practills",
                audience: userId,
                subject: subject,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // console.log("Refresh Token Error" +err);

                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    };

    /**
     * verifyRefreshToken
     * @param {*} refreshToken
     * @returns
     */
    static verifyRefreshToken = async (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized());

                const userId = payload.aud;

                resolve({ user_id: userId, user_type: payload.sub });
            });
        });
    };

    /**
 * getTokenInfo
 * @param {*} token
 * @returns
 */
    static getTokenInfo = async (token) => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
                if (err) {
                    const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                    reject(createError.Unauthorized(message));
                }

                const result = {
                    subject: payload.sub,
                    audience: payload.aud,
                };

                resolve(result);
            });
        });
    };
}
module.exports = JwtHelper;
