const router = require ("express").Router()
const worshipOfficeController = require("../controllers/worshipOfficeControllerEN")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(worshipOfficeController.readAll)
.post(authorizeAdmin, worshipOfficeController.create);


router
.route("/:id")
.get(worshipOfficeController.readSingle)
.put(authorizeAdmin, worshipOfficeController.updateSingle)
.delete(authorizeAdmin, worshipOfficeController.deleteSingle);


module.exports = router;