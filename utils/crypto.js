const Cryptr = require("cryptr");
const secret_key = "PRACTILLS-SECRET-KEY";
const cryptr = new Cryptr(secret_key, { pbkdf2Iterations: 10000, saltLength: 10 });

function encrypt(value) {
    return cryptr.encrypt(value);
}

function decrypt(value) {
    return cryptr.decrypt(value);
}

module.exports = {
    encrypt,
    decrypt,
};
