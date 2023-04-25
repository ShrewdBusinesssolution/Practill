const express = require("express");
const router = express.Router();

// const multer = require("multer");
// //Configuration for Multer
// const multerStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/user/profiles");
//     },
//     filename: function (req, file, cb) {
//         const ext = file.mimetype.split("/")[1];
//         const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
//         cb(null, name);
//     },
// });

// // Multer Filter
// const multerFilter = (req, file, cb) => {
//     const whitelist = ["image/png", "image/jpeg", "image/jpg"];
//     if (!whitelist.includes(file.mimetype)) {
//         return cb(new Error("Image is not allowed"));
//     }

//     const fileSize = parseInt(req.headers["content-length"]);
//     if (fileSize > 1000000) {
//         return cb(new Error("Image size is too large"));
//     }
//     cb(null, true);
// };

// //Calling the "multer" Function
// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter,
//     limits: { fileSize: 1000000 },
// });

// CONTROLLER ASSIGNMENTS
const StudentController = require("@controllers/students/StudentController");
const DashboardController = require("@controllers/students/DashboardController");
const QuestionController = require("@controllers/students/QuestionController");
const CertificateController = require("@controllers/students/CertificateController");









// END CONTROLLER ASSIGNMENTS

// ROUTES START

router.post("/store-interest", StudentController.storeStudentInterest);
router.get("/dashboard-details", DashboardController.dashboardDetails);
router.get("/my-certificates", CertificateController.myCertificates);
router.get("/questions", QuestionController.questions);
router.post("/write-answer", QuestionController.storeStudentAnswer);
router.get("/profile", StudentController.profile);
router.post("/my-activity", StudentController.myActivity);




// END ROUTES

module.exports = router;
