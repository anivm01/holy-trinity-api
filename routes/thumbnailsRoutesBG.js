const router = require ("express").Router()
const thumbnailsControllerBG = require("../controllers/thumbnailsControllerBG")

router
.route("/:id")
.get(thumbnailsControllerBG.readSingle)

module.exports = router;