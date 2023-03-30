const router = require ("express").Router()
const eventControllerBG = require("../controllers/eventControllerBG")

router
.route("/")
.get(eventControllerBG.readAll)
.post(eventControllerBG.create);


router
.route("/:id")
.get(eventControllerBG.readSingle)
.put(eventControllerBG.updateSingle)


module.exports = router;