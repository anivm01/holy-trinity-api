const router = require ("express").Router()
const eventControllerEN = require("../controllers/eventControllerEN")

router
.route("/")
.get(eventControllerEN.readAll)
.post(eventControllerEN.create);

router
.route("/:id")
.get(eventControllerEN.readSingle)
.put(eventControllerEN.updateSingle)
.delete(eventControllerEN.deleteSingle);



module.exports = router;