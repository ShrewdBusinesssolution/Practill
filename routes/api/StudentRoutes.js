const express = require("express");
const router = express.Router();

// CONTROLLER ASSIGNMENTS
const StudentController = require("@controllers/students/StudentController");
const DashboardController = require("@controllers/DashboardController");
const QuestionController = require("@controllers/students/QuestionController");
const CertificateController = require("@controllers/students/CertificateController");









// END CONTROLLER ASSIGNMENTS

// ROUTES START

router.post("/store-interest", StudentController.storeStudentInterest);
router.get("/dashboard-details", DashboardController.studentDashboardDetails);
router.get("/my-certificates", CertificateController.myCertificates);
router.get("/questions", QuestionController.questions);
router.post("/write-answer", QuestionController.storeStudentAnswer);
router.get("/profile", StudentController.profile);
router.post("/my-activity", StudentController.myActivity);




// END ROUTES

module.exports = router;
