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



module.exports = router;
