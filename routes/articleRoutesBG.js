const router = require ("express").Router()
const articleController = require("../controllers/articleControllerBG")

router
.route("/")
.get(articleController.readAll)
.post(articleController.create);


router
.route("/:id")
.get(articleController.readSingle)
.put(articleController.updateSingle)


module.exports = router;