const knex = require("knex")(require("../knexfile"));

exports.readSingle = async (req, res) => {
    try {
      const entryData = await knex
        .select("*")
        .from("thumbnails_bg")
        .where({ worship_office: req.params.id});
        // if (entryData.length === 0) {
        //   return res.status(404).json({
        //     status: 404,
        //     message: "Not Found: Couldn't find any data.",
        //   });
        // }
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