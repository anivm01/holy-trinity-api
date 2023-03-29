const knex = require("knex")(require("../knexfile"));

exports.readSingle = async (req, res) => {
    try {
      const entryData = await knex
        .select("*")
        .from("featured_images")
        .where({ article: req.params.id});
      return res.json(entryData[0]);
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 500,
          message: "There was an issue with the database",
          error: error,
        });
    }
  };