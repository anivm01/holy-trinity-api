const router = require("express").Router();
const articleControllerBG = require("../controllers/articleControllerBG");
const eventControllerBG = require("../controllers/eventControllerBG");
const obituaryControllerBG = require("../controllers/obituaryControllerBG");
const weeklyAnnouncementControllerBG = require("../controllers/weeklyAnnouncementControllerBG");
const worshipOfficeControllerBG = require("../controllers/worshipOfficeControllerBG");

router.route("/articles").get(articleControllerBG.readPublished);
router.route("/events").get(eventControllerBG.readPublished);
router.route("/obituaries").get(obituaryControllerBG.readPublished);
router.route("/announcements").get(weeklyAnnouncementControllerBG.readPublished);
router.route("/worship-offices").get(worshipOfficeControllerBG.readPublished);


router.route("/events/upcoming/:date").get(eventControllerBG.readUpcoming);

router.route("/articles/past/:date").get(articleControllerBG.readPast);
router.route("/events/past/:date").get(eventControllerBG.readPast);
router.route("/obituaries/past/:date").get(obituaryControllerBG.readPast);
router.route("/worship-offices/past/:date").get(worshipOfficeControllerBG.readPast);

router.route("/announcements/latest/:date").get(weeklyAnnouncementControllerBG.readSingleMostRecent);

module.exports = router;
