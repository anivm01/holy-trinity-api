const router = require ("express").Router()
const articleController = require("../controllers/articleControllerEN")

router
.route("/")
.get(articleController.readAll)
.post(articleController.create);

router
.route("/:id")
.get(articleController.readSingle)
.put(articleController.updateSingle)
.delete(articleController.deleteSingle);


module.exports = router;