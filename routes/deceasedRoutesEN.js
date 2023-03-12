const router = require ("express").Router()
const deceasedControllerEN = require("../controllers/deceasedControllerEN")

router
.route("/:id")
.get(deceasedControllerEN.readSingle)

module.exports = router;