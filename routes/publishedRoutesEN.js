const router = require("express").Router();
const articleControllerEN = require("../controllers/articleControllerEN");
const eventControllerEN = require("../controllers/eventControllerEN");
const obituaryControllerEN = require("../controllers/obituaryControllerEN");
const weeklyAnnouncementControllerEN = require("../controllers/weeklyAnnouncementControllerEN");
const worshipOfficeControllerEN = require("../controllers/worshipOfficeControllerEN");

//deliver all published posts only sorted by date (includes future and past)
router.route("/articles").get(articleControllerEN.readPublished);
router.route("/events").get(eventControllerEN.readPublished);
router.route("/obituaries").get(obituaryControllerEN.readPublished);
router.route("/announcements").get(weeklyAnnouncementControllerEN.readPublished);
router.route("/worship-offices").get(worshipOfficeControllerEN.readPublished);


//deliver only upcoming published events sorted from soonest to furthest away
router.route("/events/upcoming/:date").get(eventControllerEN.readUpcoming);


//deliver published posts that are dated before the date the request was made
router.route("/articles/past/:date").get(articleControllerEN.readPast);
router.route("/events/past/:date").get(eventControllerEN.readPast);
router.route("/obituaries/past/:date").get(obituaryControllerEN.readPast);
router.route("/worship-offices/past/:date").get(worshipOfficeControllerEN.readPast);


//deliver the latest published content to home page 
router.route("/announcements/latest/:date").get(weeklyAnnouncementControllerEN.readSingleMostRecent);
router.route("/events/closest-upcoming/:date").get(eventControllerEN.readSingleClosestUpcoming);
router.route("/articles/latest/:date").get(articleControllerEN.readLatest);
router.route("/worship-offices/latest/:date").get(worshipOfficeControllerEN.readLatest);




module.exports = router;
