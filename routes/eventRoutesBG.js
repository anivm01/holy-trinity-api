const router = require ("express").Router()
const eventControllerBG = require("../controllers/eventControllerBG")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(eventControllerBG.readAll)
.post(authorizeAdmin, eventControllerBG.create);


router
.route("/:id")
.get(eventControllerBG.readSingle)
.put(authorizeAdmin, eventControllerBG.updateSingle)


module.exports = router;