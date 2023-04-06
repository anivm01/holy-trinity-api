const router = require ("express").Router()
const obituaryController = require("../controllers/obituaryControllerEN")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(obituaryController.readAll)
.post(authorizeAdmin, obituaryController.create);


router
.route("/:id")
.get(obituaryController.readSingle)
.put(authorizeAdmin, obituaryController.updateSingle)
.delete(authorizeAdmin, obituaryController.deleteSingle);


module.exports = router;