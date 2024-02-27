const router = require("express").Router()
const calendarController = require("../controllers/calendarController")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
    .route("/")
    .get(calendarController.readAll)
    .post(authorizeAdmin, calendarController.create);

router.route("/bydate/:date").get(calendarController.readSingleByDate)

router
    .route("/:id")
    .get(calendarController.readSingle)
    .put(authorizeAdmin, calendarController.updateSingle)
    .delete(authorizeAdmin, calendarController.deleteSingle);



module.exports = router;