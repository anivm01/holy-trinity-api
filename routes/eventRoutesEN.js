const router = require ("express").Router()
const eventController = require("../controllers/eventControllerEN")

router
.route("/")
.get(eventController.readAll)
.post(eventController.create);


router
.route("/:id")
.get(eventController.readSingle)
.put(eventController.updateSingle)
.delete(eventController.deleteSingle);


module.exports = router;