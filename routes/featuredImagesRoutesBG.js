const router = require ("express").Router()
const featuredImagesControllerBG = require("../controllers/featuredImagesControllerBG")

router
.route("/:id")
.get(featuredImagesControllerBG.readSingle)

module.exports = router;