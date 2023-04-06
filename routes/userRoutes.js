const router = require ("express").Router()
const usersController = require("../controllers/usersController.js")
const { passwordEncrypt, passwordValidate } = require("../middleware/passwordHashing")

router
.route("/signup")
.post(passwordEncrypt, usersController.signup);

router
.route("/login")
.post(passwordValidate, usersController.login);

module.exports = router;