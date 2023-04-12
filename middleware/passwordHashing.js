const bcrypt = require("bcrypt");
const knex = require('knex')(require("../knexfile"));

const passwordEncrypt = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(400).send("error encrypting the password")
        }
        req.body.password = hash
        next();
    })
}

const passwordValidate = async (req, res, next) => {
    if (!req.body.email || !req.body.password){
        return res.status(400).json({error:"Login requires username and password fields"})
     }
    try {
        const foundUsers = await knex ('users')
                            .select("*")
                            .where({email: req.body.email})

        if (foundUsers.length === 0) {
            return res.status(401).json({error:"invalid login credentials"})
        }
        const passwordIsValid = await bcrypt.compare(req.body.password, foundUsers[0].password)
        if(!passwordIsValid){
            return res.status(401).json({error:"incorrect password"})
        }
    }
    catch (err) {
        return res.status(500).json({message:"There was an error", error: err})
    }
    next();
}

module.exports = { passwordEncrypt, passwordValidate }