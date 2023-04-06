const router = require ("express").Router()
const articleController = require("../controllers/articleControllerBG")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(articleController.readAll)
.post(authorizeAdmin, articleController.create);


router
.route("/:id")
.get(articleController.readSingle)
.put(authorizeAdmin, articleController.updateSingle)


module.exports = router;