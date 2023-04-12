const router = require ("express").Router()
const weeklyAnnouncementControllerEN = require("../controllers/weeklyAnnouncementControllerEN")
const authorizeAdmin = require("../middleware/authorizeAdmin")
router
.route("/")
.get(weeklyAnnouncementControllerEN.readAll)
.post(authorizeAdmin, weeklyAnnouncementControllerEN.create);


router
.route("/:id")
.get(weeklyAnnouncementControllerEN.readSingle)
.put(authorizeAdmin, weeklyAnnouncementControllerEN.updateSingle)
.delete(authorizeAdmin, weeklyAnnouncementControllerEN.deleteSingle);


module.exports = router;