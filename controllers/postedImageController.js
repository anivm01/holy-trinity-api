const knex = require("knex")(require("../knexfile"));

exports.readAll = async (req, res) => {
  try {
    const articlesBG = await knex
      .select("id")
      .from("article_bg")
      .where({ featured_img_id: req.params.id });

    const articlesEN = await knex
      .select("id")
      .from("article")
      .where({ featured_img_id: req.params.id });

    const worshipOfficesEN = await knex
      .select("id")
      .from("worship_office")
      .where({ thumbnail_id: req.params.id });

    const worshipOfficesBG = await knex
      .select("id")
      .from("worship_office_bg")
      .where({ thumbnail_id: req.params.id });

    const obituariesEN = await knex
      .select("id")
      .from("obituary")
      .where({ image_id: req.params.id });

    const obituariesBG = await knex
      .select("id")
      .from("obituary_bg")
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
