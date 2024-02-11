const router = require("express").Router()
const reosurcesController = require("../controllers/resourcesController")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
    .route("/")
    .get(reosurcesController.readAll)
    .post(authorizeAdmin, reosurcesController.create);

router
    .route("/:id")
    .get(reosurcesController.readSingle)
    .put(authorizeAdmin, reosurcesController.updateSingle)
    .delete(authorizeAdmin, reosurcesController.deleteSingle);



module.exports = router;