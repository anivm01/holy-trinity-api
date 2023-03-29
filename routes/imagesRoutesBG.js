const router = require ("express").Router()
const imagesController = require("../controllers/imagesControllerBG")
const multer = require('multer');
const upload = multer({ dest: 'images/' })

router
.route("/:id")
.get(imagesController.readSingle)

module.exports = router;