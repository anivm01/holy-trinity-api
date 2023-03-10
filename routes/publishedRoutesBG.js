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


module.exports = router;
