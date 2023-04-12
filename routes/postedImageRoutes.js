const router = require ("express").Router()
const postedImageRoutes = require("../controllers/postedImageController")

router
.route("/:id")
.get(postedImageRoutes.readAll)

module.exports = router;