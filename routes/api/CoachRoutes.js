const express = require("express");
const router = express.Router();

const multer = require("multer");
//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/applications/event");
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
        cb(null, name);
    },
});

// Multer Filter
var MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const multerFilter = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > MAX_IMAGE_SIZE) {
        return cb(new Error("Image size is too large"));
    }
    cb(null, true);
};

//Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
});

// CONTROLLER ASSIGNMENTS
const DashboardController = require("@controllers/DashboardController");
const CoachController = require("@controllers/CoachController");
const AdminController = require("@controllers/AdminController");
const ActivityController = require("@controllers/ActivityController");
const CertificateController = require("@controllers/CertificateController");
const EventController = require("@controllers/EventController");





// END CONTROLLER ASSIGNMENTS

// ROUTES START
router.get("/announcement-details", AdminController.announcementDetails);

router.get("/dashboard-details", DashboardController.coachDashboardDetails);
router.get("/profile", CoachController.profile);
router.get("/coach-schools", CoachController.coachSchools);
router.post("/coach-students", CoachController.coachStudents);
router.post("/student-activity", ActivityController.studentActivity);
router.post("/club-activity", ActivityController.clubActivity);
router.post("/game-activity", ActivityController.gameActivity);
router.post("/student-certificates", CertificateController.studentCertificates);


router.post("/create-event", upload.single('event_image'),EventController.createEvent);
router.post("/update-event", upload.single('event_image'), EventController.updateEvent);
router.post("/delete-event", EventController.deleteEvent);


// END ROUTES

module.exports = router;
