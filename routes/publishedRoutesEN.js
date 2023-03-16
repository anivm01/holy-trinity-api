const router = require("express").Router();
const articleControllerEN = require("../controllers/articleControllerEN");
const eventControllerEN = require("../controllers/eventControllerEN");
const obituaryControllerEN = require("../controllers/obituaryControllerEN");
const weeklyAnnouncementControllerEN = require("../controllers/weeklyAnnouncementControllerEN");
const worshipOfficeControllerEN = require("../controllers/worshipOfficeControllerEN");


router.route("/articles").get(articleControllerEN.readPublished);
router.route("/events").get(eventControllerEN.readPublished);
router.route("/obituaries").get(obituaryControllerEN.readPublished);
router.route("/announcements").get(weeklyAnnouncementControllerEN.readPublished);
router.route("/worship-offices").get(worshipOfficeControllerEN.readPublished);

router.route("/events/upcoming/:date").get(eventControllerEN.readUpcoming);

router.route("/articles/past/:date").get(articleControllerEN.readPast);
router.route("/events/past/:date").get(eventControllerEN.readPast);
router.route("/obituaries/past/:date").get(obituaryControllerEN.readPast);
router.route("/worship-offices/past/:date").get(worshipOfficeControllerEN.readPast);

router.route("/announcements/latest/:date").get(weeklyAnnouncementControllerEN.readSingleMostRecent);


module.exports = router;
