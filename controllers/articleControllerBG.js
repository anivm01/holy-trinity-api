const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");

exports.create = async (req, res) => {
  try {
    //req verification
    if (
      typeof(req.body.bg_version) !== 'boolean' ||
      !req.body.date ||
      !req.body.en_id
    ) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //create new entry
    const newEntry = {
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
      date: req.body.date,
      bg_version: req.body.bg_version,
      en_id: req.body.en_id,
    };
    const result = await knex("article_bg").insert(newEntry);
    //check if new entry was created successfully
    const createdEntry = await knex("article_bg").select("*").where({
      id: result[0],
    });
    //create associated image if one is provided
    let image = [];
    //check if image is provided
    if (req.body.featured_img_id) {
      const newImage = {
        image_id: req.body.featured_img_id,
        article: createdEntry[0].en_id,
      };
      //create associate image entry
      const imageResult = await knex("featured_images_bg").insert(newImage);
      image = await knex("featured_images_bg").select("*").where({
        id: imageResult[0],
      });
    }
    //send response
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

exports.updateSingle = async (req, res) => {
  try {
    //req verification
    if (typeof(req.body.bg_version) !== 'boolean' || !req.body.date) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //create entry update
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

    //find updated entry
    const updatedEntry = await knex("article_bg").select("*").where({
      en_id: req.params.id,
    });

    // update image
    let image;
    //check if image id has been provided

    if (req.body.featured_img_id) {
      //check if this entry already has an associated image
      const imageUpdate = {
        image_id: req.body.featured_img_id,
        article: req.params.id,
      };
      const featuredImage = await knex("featured_images_bg").select("*").where({
        article: req.params.id,
      });
      //if yes update the image id
      if (featuredImage.length > 0) {
        await knex("featured_images_bg")
          .where({ article: req.params.id })
          .update(imageUpdate);
      }
      //if no create a new associated image entry
      else {
        await knex("featured_images_bg").insert(imageUpdate);
      }
      image = await knex("featured_images_bg").select("*").where({
        article: req.params.id,
      });
    }
    //send response
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
      .select(
        "article_bg.id",
        "article_bg.bg_version",
        "article_bg.title",
        "article_bg.author",
        "article_bg.content",
        "article_bg.date",
        "article_bg.en_id"
      )
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
exports.readPast = async (req, res) => {
  try {
    const entryData = await knex("article_bg")
      .where({ bg_version: true })
      .join("article", { "article_bg.en_id": "article.id" })
      .select(
        "article_bg.id",
        "article_bg.bg_version",
        "article_bg.title",
        "article_bg.author",
        "article_bg.content",
        "article_bg.date",
        "article_bg.en_id"
      )
      .where({ "article.is_draft": false });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    const pastData = sortedData.filter((single) => {
      return single.date < req.params.date;
    });
    return res.status(200).json(pastData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};
exports.readLatest = async (req, res) => {
  try {
    const entryData = await knex("article_bg")
      .where({ bg_version: true })
      .join("article", { "article_bg.en_id": "article.id" })
      .select(
        "article_bg.id",
        "article_bg.bg_version",
        "article_bg.title",
        "article_bg.author",
        "article_bg.content",
        "article_bg.date",
        "article_bg.en_id"
      )
      .where({ "article.is_draft": false });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    const pastData = sortedData.filter((single) => {
      return single.date < req.params.date;
    });
    let latestData = [];
    if (pastData.length > 6) {
      latestData = pastData.slice(0, 6);
    } else latestData = pastData;
    return res.status(200).json(latestData);
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
