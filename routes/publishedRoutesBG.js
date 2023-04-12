const router = require("express").Router();
const articleControllerBG = require("../controllers/articleControllerBG");
const eventControllerBG = require("../controllers/eventControllerBG");
const obituaryControllerBG = require("../controllers/obituaryControllerBG");
const weeklyAnnouncementControllerBG = require("../controllers/weeklyAnnouncementControllerBG");
const worshipOfficeControllerBG = require("../controllers/worshipOfficeControllerBG");

//deliver all published posts only sorted by date (includes future and past)
router.route("/articles").get(articleControllerBG.readPublished);
router.route("/events").get(eventControllerBG.readPublished);
router.route("/obituaries").get(obituaryControllerBG.readPublished);
router.route("/announcements").get(weeklyAnnouncementControllerBG.readPublished);
router.route("/worship-offices").get(worshipOfficeControllerBG.readPublished);

//deliver only upcoming published events sorted from soonest to furthest away
router.route("/events/upcoming/:date").get(eventControllerBG.readUpcoming);

//deliver published posts that are dated before the date the request was made
router.route("/articles/past/:date").get(articleControllerBG.readPast);
router.route("/events/past/:date").get(eventControllerBG.readPast);
router.route("/obituaries/past/:date").get(obituaryControllerBG.readPast);
router.route("/worship-offices/past/:date").get(worshipOfficeControllerBG.readPast);

//deliver the latest published content to home page 
router.route("/announcements/latest/:date").get(weeklyAnnouncementControllerBG.readSingleMostRecent);
router.route("/events/closest-upcoming/:date").get(eventControllerBG.readSingleClosestUpcoming);
router.route("/articles/latest/:date").get(articleControllerBG.readLatest);
router.route("/worship-offices/latest/:date").get(worshipOfficeControllerBG.readLatest);


module.exports = router;
