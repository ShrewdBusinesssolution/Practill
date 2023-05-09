const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("@middlewares/JwtVerification");

const multer = require("multer");
//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/applications/post");
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
const CoachController = require("@controllers/CoachController");
const AdminController = require("@controllers/AdminController");
const StudentController = require("@controllers/students/StudentController");
const ClubController = require("@controllers/ClubController");
const createClubSchema = require("@validation-schemas/ClubSchema");
const OnboardingController = require("@controllers/OnboardingController");
const InterestController = require("@controllers/InterestController");
const SchoolController = require("@controllers/SchoolController");
const PostController = require("@controllers/PostController");
const PostLikeController = require("@controllers/PostLikeController");
const PostCommentController = require("@controllers/PostCommentController");
const PostBookmarkController = require("@controllers/PostBookmarkController");
const EventController = require("@controllers/EventController");
const NotificationController = require("@controllers/NotificationController");
const CertificateController = require("@controllers/CertificateController");
const GameController = require("@controllers/GameController");




// END CONTROLLER ASSIGNMENTS

// ROUTES START

router.get("/onboard-details", OnboardingController.index);
router.get("/interest-details", InterestController.index);
router.get("/school-details", SchoolController.index);
router.post("/event-details", verifyAccessToken, EventController.index);
router.get("/certificate-details", verifyAccessToken,CertificateController.index);
router.get("/game-details", verifyAccessToken, GameController.index);



router.get("/club-list", ClubController.clubDetails);
router.post("/join-club", ClubController.joinClub);
router.get("/my-clubs", ClubController.myClubs);


router.post("/create-post", verifyAccessToken, upload.array("post_file",5), PostController.createPost);
router.post("/update-post", verifyAccessToken,PostController.updatePost);
router.post("/remove-post", verifyAccessToken, PostController.deletePost);

router.post("/post-details", verifyAccessToken, PostController.postDetails);
router.post("/my-post-details", verifyAccessToken, PostController.mypostDetails);
router.post("/my-bookmarks", verifyAccessToken, PostBookmarkController.mybookmarkDetails);
router.post("/add-like", verifyAccessToken, PostLikeController.likePost);
router.post("/add-bookmark", verifyAccessToken, PostBookmarkController.bookmarkPost);
router.post("/get-comment", verifyAccessToken, PostCommentController.index);
router.post("/add-comment", verifyAccessToken, PostCommentController.storePostComment);
router.post("/remove-comment", verifyAccessToken, PostCommentController.deletePostComment);
router.post("/tag-users", verifyAccessToken, PostController.tagUsers);
router.post("/remove-tag", verifyAccessToken, PostController.deleteTagUser);
router.get("/notifications", verifyAccessToken, NotificationController.notificationDetails);
router.post("/notification-post-details", verifyAccessToken, PostController.notificationPostDetails);


router.post("/create-student", StudentController.createStudent);
router.post("/update-student", verifyAccessToken, upload.single('profile_image'), StudentController.updateStudent);

router.get("/coach-type", CoachController.coachType);
router.post("/coach-id", CoachController.coachId);
router.post("/create-coach", CoachController.createCoach);
router.post("/update-coach", verifyAccessToken, upload.single('profile_image'), CoachController.updateCoach);
router.post("/delete-coach", CoachController.deleteCoach);

router.post("/create-admin", AdminController.createAdmin);

router.post("/create-club", ClubController.createClub);
router.post("/delete-club", ClubController.deleteClub);


// END ROUTES

module.exports = router;
