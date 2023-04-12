const knex = require("knex")(require("../knexfile"));

exports.readAll = async (req, res) => {
  try {
    const articlesBG = await knex
      .select("article")
      .from("featured_images_bg")
      .where({ image_id: req.params.id });

    const articlesEN = await knex
      .select("article")
      .from("featured_images")
      .where({ image_id: req.params.id });

    const worshipOfficesEN = await knex
      .select("worship_office")
      .from("thumbnails")
      .where({ image_id: req.params.id });

    const worshipOfficesBG = await knex
      .select("worship_office")
      .from("thumbnails_bg")
      .where({ image_id: req.params.id });

    const obituariesEN = await knex
      .select("obituary")
      .from("deceased")
      .where({ image_id: req.params.id });

    const obituariesBG = await knex
      .select("obituary")
      .from("deceased_bg")
      .where({ image_id: req.params.id });

    res
      .status(200)
      .json({
        articles_en: articlesEN,
        articles_bg: articlesBG,
        worship_offices_en: worshipOfficesEN,
        worship_offices_bg: worshipOfficesBG,
        obituaries_en: obituariesEN,
        obituaries_bg: obituariesBG,
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};
