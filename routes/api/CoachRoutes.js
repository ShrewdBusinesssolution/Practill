const express = require("express");
const router = express.Router();

// CONTROLLER ASSIGNMENTS
const DashboardController = require("@controllers/DashboardController");
const CoachController = require("@controllers/CoachController");










// END CONTROLLER ASSIGNMENTS

// ROUTES START

router.get("/dashboard-details", DashboardController.coachDashboardDetails);
router.get("/profile", CoachController.profile);

// END ROUTES

module.exports = router;
