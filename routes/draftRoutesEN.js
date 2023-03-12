const router = require("express").Router();
const articleControllerEN = require("../controllers/articleControllerEN");
const eventControllerEN = require("../controllers/eventControllerEN");
const obituaryControllerEN = require("../controllers/obituaryControllerEN");
const weeklyAnnouncementControllerEN = require("../controllers/weeklyAnnouncementControllerEN");
const worshipOfficeControllerEN = require("../controllers/worshipOfficeControllerEN");


router.route("/articles").get(articleControllerEN.readDrafts);
router.route("/events").get(eventControllerEN.readDrafts);
router.route("/obituaries").get(obituaryControllerEN.readDrafts);
router.route("/announcements").get(weeklyAnnouncementControllerEN.readDrafts);
router.route("/worship-offices").get(worshipOfficeControllerEN.readDrafts);



module.exports = router;