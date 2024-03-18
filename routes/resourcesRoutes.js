const router = require("express").Router()
const resourcesController = require("../controllers/resourcesController")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
    .route("/")
    .get(resourcesController.readAll)
    .post(authorizeAdmin, resourcesController.create);

router
    .route("/:id")
    .get(resourcesController.readSingle)
    .put(authorizeAdmin, resourcesController.updateSingle)
    .delete(authorizeAdmin, resourcesController.deleteSingle);



module.exports = router;