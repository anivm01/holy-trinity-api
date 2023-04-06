const router = require ("express").Router()
const articleController = require("../controllers/articleControllerEN")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(articleController.readAll)
.post(authorizeAdmin, articleController.create);

router
.route("/:id")
.get(articleController.readSingle)
.put(authorizeAdmin, articleController.updateSingle)
.delete(authorizeAdmin, articleController.deleteSingle);


module.exports = router;