const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");
const { s3Client } = require("../utilities/s3Client.js")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { GetObjectCommand } = require("@aws-sdk/client-s3");

exports.create = async (req, res) => {
  try {
    //req verification
    if (typeof req.body.is_draft !== "boolean" || !req.body.date) {
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
      is_draft: req.body.is_draft,
      date: req.body.date,
    };
    const result = await knex("article").insert(newEntry);

    //check if new entry was created successfully
    const createdEntry = await knex("article").select("*").where({
      id: result[0],
    });

    //create associated image if one is provided
    let image = [];
    //check if image is provided
    if (req.body.featured_img_id) {
      const newImage = {
        image_id: req.body.featured_img_id,
        article: createdEntry[0].id,
      };
      //create associate image entry
      const imageResult = await knex("featured_images").insert(newImage);
      image = await knex("featured_images").select("*").where({
        image_id: imageResult[0],
      });
    }

    //send response
    return res.status(201).json({
      message: "Entry successfully created",
      new_entry: createdEntry[0],
      image: image[0],
    });
  } catch (error) {
    //log out the error
    console.log(error);

    //send error response
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
    if (!req.body.date || typeof req.body.is_draft !== "boolean") {
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
      is_draft: req.body.is_draft,
      date: req.body.date,
    };

    await knex("article").where({ id: req.params.id }).update(entryUpdate);

    //find updated entry
    const updatedVersion = await knex("article").select("*").where({
      id: req.params.id,
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
      const featuredImage = await knex("featured_images").select("*").where({
        article: req.params.id,
      });
      //if yes update the image id
      if (featuredImage.length > 0) {
        await knex("featured_images")
          .where({ id: featuredImage[0].id })
          .update(imageUpdate);
      }
      //if no create a new associated image entry
      else {
        await knex("featured_images").insert(imageUpdate);
      }
      image = await knex("featured_images").select("*").where({
        article: req.params.id,
      });
    }
    //send response
    return res.status(201).json({
      message: "ok",
      updated_entry: updatedVersion[0],
      image: image[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Unable to update the entry",
      error: error,
    });
  }
};

//delete function deletes the announcement from both the english and the bulgarian tables because of CASCADE
exports.deleteSingle = async (req, res) => {
  try {
    const existingEntry = await knex("article")
      .select("*")
      .where({ id: req.params.id });
    if (existingEntry.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Couldn't find the entry you're trying to delete",
      });
    }
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

exports.readSingle = async (req, res) => {
  try {
    const entryData = await knex("article")
    .leftJoin("featured_images", { "featured_images.article": "article.id" })
    .leftJoin("images", {"featured_images.image_id":"images.id"})
      .select(
        "article.id",
        "article.title",
        "article.author",
        "article.content",
        "article.date",
        "featured_images.image_id",
        "images.url",
        "images.description"
      )
      .where({ "article.id": req.params.id });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Coundn't find the entry you were looking for",
      });
    }
    if (entryData[0].url !== null) {
      entryData[0].src = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: "holy-trinity-image-storage",
          Key: entryData[0].url
        }),
        { expiresIn: 120 }// 120 seconds
      )
    }
    console.log(entryData[0])
    return res.json(entryData[0]);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readAll = async (_req, res) => {
  try {
    const entryData = await knex.select("*").from("article");
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
    const entryData = await knex
      .select("*")
      .from("article")
      .where({ is_draft: false });
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
    const entryData = await knex("article")
      .leftJoin("featured_images", { "featured_images.article": "article.id" })
      .leftJoin("images", {"featured_images.image_id":"images.id"})
      .select(
        "article.id",
        "article.title",
        "article.author",
        "article.content",
        "article.date",
        "images.url",
        "images.description"
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
    const removedEmpty = pastData.filter((single) => {
      return (
        single.title !== null &&
        single.title !== false &&
        single.title !== "" &&
        single.content.length > 7
      );
    });
    
    for (let single of removedEmpty) {
      if(single.url !== null) {
        single.src = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: "holy-trinity-image-storage",
            Key: single.url
          }),
          { expiresIn: 120 }// 120 seconds
        )
      }
    }
    return res.status(200).json(removedEmpty);
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
    const entryData = await knex("article")
    .leftJoin("featured_images", { "featured_images.article": "article.id" })
    .leftJoin("images", {"featured_images.image_id":"images.id"})
      .select(
        "article.id",
        "article.title",
        "article.author",
        "article.content",
        "article.date",
        "images.url",
        "images.description"
      )
      .where({ is_draft: false });
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
    const removedEmpty = pastData.filter((single) => {
      return (
        single.title.length != null &&
        single.title !== false &&
        single.title !== "" &&
        single.content.length > 7
      );
    });
    let latestData = [];
    if (removedEmpty.length > 9) {
      latestData = removedEmpty.slice(0, 9);
    } else latestData = removedEmpty;
    for (let single of latestData) {
      if(single.url !== null) {
        single.src = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: "holy-trinity-image-storage",
            Key: single.url
          }),
          { expiresIn: 120 }// 120 seconds
        )
      }
    }
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
    const entryData = await knex
      .select("*")
      .from("article")
      .where({ is_draft: true });
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
