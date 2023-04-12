const router = require ("express").Router()
const imagesControllerBG = require("../controllers/imagesControllerBG")

router
.route("/:id")
.get(imagesControllerBG.readSingle)

module.exports = router;