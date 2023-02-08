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

// add a route to get weekly announcement by date. 
// have to be able to get the most current announcement.
// make the call based on date now and then search the database for all the announcements before that date
// then sort them from newest to oldest
// return the newest one