const router = require("express").Router();
const articleControllerBG = require("../controllers/articleControllerBG");
const eventControllerBG = require("../controllers/eventControllerBG");
const obituaryControllerBG = require("../controllers/obituaryControllerBG");
const weeklyAnnouncementControllerBG = require("../controllers/weeklyAnnouncementControllerBG");
const worshipOfficeControllerBG = require("../controllers/worshipOfficeControllerBG");

router.route("/articles").get(articleControllerBG.readDrafts);
router.route("/events").get(eventControllerBG.readDrafts);
router.route("/obituaries").get(obituaryControllerBG.readDrafts);
router.route("/announcements").get(weeklyAnnouncementControllerBG.readDrafts);
router.route("/worship-offices").get(worshipOfficeControllerBG.readDrafts);


module.exports = router;
