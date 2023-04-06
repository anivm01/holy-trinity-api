const router = require("express").Router();
const imagesController = require("../controllers/imagesControllerEN");
const multer = require("multer");
const authorizeAdmin = require("../middleware/authorizeAdmin")

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router
  .route("/")
  .get(imagesController.readAll)
  .post(authorizeAdmin, upload.single('image'), imagesController.create);

router
  .route("/:id")
  .get(imagesController.readSingle)
  .delete(authorizeAdmin, imagesController.deleteSingle);

module.exports = router;
