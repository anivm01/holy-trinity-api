const router = require ("express").Router()
const worshipOfficeControllerBG = require("../controllers/worshipOfficeControllerBG")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(worshipOfficeControllerBG.readAll)
.post(authorizeAdmin, worshipOfficeControllerBG.create);


router
.route("/:id")
.get(worshipOfficeControllerBG.readSingle)
.put(authorizeAdmin, worshipOfficeControllerBG.updateSingle)


module.exports = router;