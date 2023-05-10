const express = require("express");
const router = express.Router();

// CONTROLLER ASSIGNMENTS
const StudentController = require("@controllers/students/StudentController");
const DashboardController = require("@controllers/DashboardController");
const QuestionController = require("@controllers/students/QuestionController");
const EventController = require("@controllers/EventController");








// END CONTROLLER ASSIGNMENTS

// ROUTES START

router.post("/store-interest", StudentController.storeStudentInterest);
router.get("/dashboard-details", DashboardController.studentDashboardDetails);
router.get("/my-certificates", StudentController.myCertificates);
router.get("/questions", QuestionController.questions);
router.post("/write-answer", QuestionController.storeStudentAnswer);
router.get("/profile", StudentController.profile);
router.post("/my-activity", StudentController.myActivity);
router.post("/event-details", EventController.coachEvent);



// END ROUTES

module.exports = router;
