const router = require ("express").Router()
const obituaryController = require("../controllers/obituaryControllerBG")

router
.route("/")
.get(obituaryController.readAll)
.post(obituaryController.create);


router
.route("/:id")
.get(obituaryController.readSingle)
.put(obituaryController.updateSingle)
.delete(obituaryController.deleteSingle);


module.exports = router;