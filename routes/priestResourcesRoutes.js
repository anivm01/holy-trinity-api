const router = require("express").Router()
const priestResourcesController = require("../controllers/priestResourcesController")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
    .route("/")
    .get(priestResourcesController.readAll)
    .post(authorizeAdmin, priestResourcesController.create);

router
    .route("/resource-order")
    .put(authorizeAdmin, priestResourcesController.createResourceOrder)

router
    .route("/category")
    .get(priestResourcesController.readAllCategories)
    .post(authorizeAdmin, priestResourcesController.createCategory)

router
    .route("/category/order")
    .put(authorizeAdmin, priestResourcesController.updateCategoryOrder)


router
    .route("/category/:id")
    .get(priestResourcesController.readCategory)
    .put(authorizeAdmin, priestResourcesController.updateCategory)
    .delete(authorizeAdmin, priestResourcesController.deleteCategory);

router
    .route("/:id")
    .put(authorizeAdmin, priestResourcesController.updateSingle)
    .delete(authorizeAdmin, priestResourcesController.deleteSingle);





module.exports = router;