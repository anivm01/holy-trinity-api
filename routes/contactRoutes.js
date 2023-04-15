const router = require ("express").Router()
const contactController = require("../controllers/contactController.js")
router
.route("/")
.post(contactController.send);

module.exports = router;