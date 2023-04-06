const router = require ("express").Router()
const obituaryController = require("../controllers/obituaryControllerBG")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(obituaryController.readAll)
.post(authorizeAdmin, obituaryController.create);


router
.route("/:id")
.get(obituaryController.readSingle)
.put(authorizeAdmin, obituaryController.updateSingle)


module.exports = router;