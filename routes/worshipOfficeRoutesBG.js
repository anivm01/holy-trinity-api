const router = require ("express").Router()
const worshipOfficeControllerBG = require("../controllers/worshipOfficeControllerBG")

router
.route("/")
.get(worshipOfficeControllerBG.readAll)
.post(worshipOfficeControllerBG.create);


router
.route("/:id")
.get(worshipOfficeControllerBG.readSingle)
.put(worshipOfficeControllerBG.updateSingle)
.delete(worshipOfficeControllerBG.deleteSingle);


module.exports = router;