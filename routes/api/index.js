const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("@middlewares/JwtVerification");

// CONTROLLER ASSIGNMENTS

// END CONTROLLER ASSIGNMENTS

// APPLICATION ROUTES
const AuthRoutes = require("./AuthRoutes");
const UserRoutes = require("./UserRoutes");
const StudentRoutes = require("./StudentRoutes");


// END APPLICATION ROUTES

// BASE ROUTES
router.get("/",async (req, res) => {
    res.send("WELCOME TO Practills APP");
});
// END BASE ROUTES

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/student", verifyAccessToken, StudentRoutes);



module.exports = router;
