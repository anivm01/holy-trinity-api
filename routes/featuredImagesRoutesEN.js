const router = require ("express").Router()
const featuredImagesControllerEN = require("../controllers/featuredImagesControllerEN")

router
.route("/:id")
.get(featuredImagesControllerEN.readSingle)

module.exports = router;