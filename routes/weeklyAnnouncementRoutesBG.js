const router = require ("express").Router()
const weeklyAnnouncementControllerBG = require("../controllers/weeklyAnnouncementControllerBG")


router
.route("/")
.get(weeklyAnnouncementControllerBG.readAll)
.post(weeklyAnnouncementControllerBG.create);

router
.route("/:id")
.get(weeklyAnnouncementControllerBG.readSingle)
.put(weeklyAnnouncementControllerBG.updateSingle)
.delete(weeklyAnnouncementControllerBG.deleteSingle);

module.exports = router;