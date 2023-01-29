const router = require ("express").Router()
const worshipOfficeController = require("../controllers/worshipOfficeControllerBG")

router
.route("/")
.get(worshipOfficeController.readAll)
.post(worshipOfficeController.create);


router
.route("/:id")
.get(worshipOfficeController.readSingle)
.put(worshipOfficeController.updateSingle)
.delete(worshipOfficeController.deleteSingle);


module.exports = router;