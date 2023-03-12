const router = require ("express").Router()
const thumbnailsControllerEN = require("../controllers/thumbnailsControllerEN")

router
.route("/:id")
.get(thumbnailsControllerEN.readSingle)

module.exports = router;