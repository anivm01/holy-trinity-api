const router = require ("express").Router()
const eventControllerEN = require("../controllers/eventControllerEN")
const authorizeAdmin = require("../middleware/authorizeAdmin")

router
.route("/")
.get(eventControllerEN.readAll)
.post(authorizeAdmin, eventControllerEN.create);

router
.route("/:id")
.get(eventControllerEN.readSingle)
.put(authorizeAdmin, eventControllerEN.updateSingle)
.delete(authorizeAdmin, eventControllerEN.deleteSingle);



module.exports = router;