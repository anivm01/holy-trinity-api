const router = require("express").Router()
const eventController = require("../controllers/eventController")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
    .route("/")
    .get(eventController.readAll)
    .post(authorizeAdmin, eventController.create);

router.route("/upcoming/:date").get(eventController.readUpcoming);

router
    .route("/:id")
    .get(eventController.readSingle)
    .put(authorizeAdmin, eventController.updateSingle)
    .delete(authorizeAdmin, eventController.deleteSingle);



module.exports = router;