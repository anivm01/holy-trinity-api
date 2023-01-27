const router = require ("express").Router()
const imagesController = require("../controllers/imagesControllerEN")
const multer = require('multer');
const upload = multer({ dest: 'images/' })
router
.route("/")
.get(imagesController.readAll)
.post(upload.single('image'), imagesController.create);

router
.route("/:id")
.get(imagesController.readSingle)
.put(imagesController.updateSingle)
.delete(imagesController.deleteSingle);

module.exports = router;