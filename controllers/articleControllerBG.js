const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");

exports.create = async (req, res) => {
  try {
    const newEntry = {
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
      date: req.body.date,
      bg_version: req.body.bg_version,
      en_id: req.body.en_id,
    };
    const result = await knex("article_bg").insert(newEntry);

    const createdEntry = await knex("article_bg").select("*").where({
      id: result[0],
    });

    let image = [];
    if (req.body.featured_img_id) {
      const newImage = {
        image_id: req.body.featured_img_id,
        article: createdEntry[0].en_id,
      };

      const imageResult = await knex("featured_images_bg").insert(newImage);
      image = await knex("featured_images_bg").select("*").where({
        id: imageResult[0],
      });
    }

    return res
      .status(201)
      .json({ message: "ok!", new_entry: createdEntry[0], image: image[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Couldn't create new entry",
      error: error,
    });
  }
};

exports.readSingle = async (req, res) => {
  try {
    const entryData = await knex
      .select("*")
      .from("article_bg")
      .where({ en_id: req.params.id });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Coundn't find the entry you were looking for",
      });
    }
    return res.json(entryData[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readAll = async (_req, res) => {
  try {
    const entryData = await knex
      .select("*")
      .from("article_bg")
      .where({ bg_version: true });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    return res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readPublished = async (_req, res) => {
  try {
    const entryData = await knex("article_bg")
      .where({ bg_version: true })
      .join("article", { "article_bg.en_id": "article.id" })
      .select("*")
      .where({ "article.is_draft": false });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    return res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};
exports.readDrafts = async (_req, res) => {
  try {
    const entryData = await knex("article_bg")
      .where({ bg_version: true })
      .join("article", { "article_bg.en_id": "article.id" })
      .select("*")
      .where({ "article.is_draft": true });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    return res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.updateSingle = async (req, res) => {
  try {
    const entryUpdate = {
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
      date: req.body.date,
      bg_version: req.body.bg_version,
    };

    await knex("article_bg")
      .where({ en_id: req.params.id })
      .update(entryUpdate);

    const updatedEntry = await knex("article_bg").select("*").where({
      en_id: req.params.id,
    });
    let image;
    if (req.body.featured_img_id) {
      const imageUpdate = {
        image_id: req.body.featured_img_id,
        article: req.params.id,
      };
      const featuredImage = await knex("featured_images_bg").select("*").where({
        article: req.params.id,
      });
      if (featuredImage.length !== 0) {
        await knex("featured_images_bg")
          .where({ article: req.params.id })
          .update(imageUpdate);
      } else {
        await knex("featured_images_bg").insert(imageUpdate);
      }
      image = await knex("featured_images_bg").select("*").where({
        article: req.params.id,
      });
    }
    return res
      .status(201)
      .json({ message: "ok", updated_entry: updatedEntry[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Unable to update the entry",
      error: error,
    });
  }
};

exports.deleteSingle = async (req, res) => {
  try {
    const existingEntry = await knex("article_bg")
      .select("*")
      .where({ en_id: req.params.id });
    if (existingEntry.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Couldn't find the entry you're trying to delete",
      });
    }
    await knex("article_bg").where({ id: existingEntry[0].id }).del();
    await knex("article").where({ id: req.params.id }).del();
    return res.status(204).json({ status: 204, message: "Delete successful" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};
