const router = require ("express").Router()
const weeklyAnnouncementControllerBG = require("../controllers/weeklyAnnouncementControllerBG")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(weeklyAnnouncementControllerBG.readAll)
.post(authorizeAdmin, weeklyAnnouncementControllerBG.create);

router
.route("/:id")
.get(weeklyAnnouncementControllerBG.readSingle)
.put(authorizeAdmin, weeklyAnnouncementControllerBG.updateSingle)

module.exports = router;