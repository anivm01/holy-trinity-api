const router = require ("express").Router()
const weeklyAnnouncementControllerEN = require("../controllers/weeklyAnnouncementControllerEN")

router
.route("/")
.get(weeklyAnnouncementControllerEN.readAll)
.post(weeklyAnnouncementControllerEN.create);


router
.route("/:id")
.get(weeklyAnnouncementControllerEN.readSingle)
.put(weeklyAnnouncementControllerEN.updateSingle)
.delete(weeklyAnnouncementControllerEN.deleteSingle);


module.exports = router;