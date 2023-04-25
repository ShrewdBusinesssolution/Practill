const express = require("express");
const router = express.Router();

// CONTROLLER ASSIGNMENTS
const AuthController = require("@controllers/AuthController");
const JwtController = require("@controllers/JwtController");
// END CONTROLLER ASSIGNMENTS

// ROUTES START
router.post("/login", AuthController.login);

router.post("/refresh-token", JwtController.refreshToken);
// END ROUTES

module.exports = router;
