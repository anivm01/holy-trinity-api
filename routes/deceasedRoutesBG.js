const router = require ("express").Router()
const deceasedControllerBG = require("../controllers/deceasedControllerBG")

router
.route("/:id")
.get(deceasedControllerBG.readSingle)

module.exports = router;