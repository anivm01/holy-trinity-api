const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const bearerTokenString = req.headers.authorization;

  if (!bearerTokenString) {
    return res
      .status(401)
      .json({
        error: "Resource requires Bearer token in Authorization header",
      });
  }

  const splitBearerTokenString = bearerTokenString.split(" ");

  if (splitBearerTokenString.length !== 2) {
    return res.status(400).json({ error: "Bearer token is malformed" });
  }

  const token = splitBearerTokenString[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    user = decoded.user_id;

    const isAdmin = await knex("users")
      .select("admin")
      .where("id", user.id)
      .first();

    if (!isAdmin || !isAdmin.admin) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: "Invalid JWT" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
