const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");
const { s3Client } = require("../utilities/s3Client.js");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

exports.create = async (req, res) => {
  try {
    //req verification
    if (
      typeof req.body.bg_version !== "boolean" ||
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
      name: req.body.name,
      obituary: req.body.obituary,
      years: req.body.years,
      date: req.body.date,
      bg_version: req.body.bg_version,
      en_id: req.body.en_id,
    };
    const result = await knex("obituary_bg").insert(newEntry);
    //find newly created entry
    const createdEntry = await knex("obituary_bg").select("*").where({
      id: result[0],
    });

    //create image association
    let image = [];
    //check if an image id was provided
    if (req.body.image_id) {
      //create associated image entry
      const newImage = {
        image_id: req.body.image_id,
        obituary: createdEntry[0].id,
      };
      const imageResult = await knex("deceased_bg").insert(newImage);
      //find created image entry
      image = await knex("deceased_bg").select("*").where({
        id: imageResult[0],
      });
    }
    //return a response with created entry and created image
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
    if (typeof req.body.bg_version !== "boolean" || !req.body.date) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //find entry to update
    existingEntry = await knex("obituary_bg")
      .select("*")
      .where({ en_id: req.params.id });
    //return error if entry doesn't exist
    if (existingEntry.length === 0) {
      res.status(404).json({
        status: 404,
        message: "The entry you're trying to update doesn't exist",
      });
    }
    //update entry
    const entryChanges = {
      name: req.body.name,
      obituary: req.body.obituary,
      years: req.body.years,
      date: req.body.date,
      bg_version: req.body.bg_version,
    };
    await knex("obituary_bg")
      .where({ en_id: req.params.id })
      .update(entryChanges);
    //find updated entry
    const updatedEntry = await knex("obituary_bg").select("*").where({
      en_id: req.params.id,
    });
    //update image association
    let image = [];
    //check if image id was provided
    if (req.body.image_id) {
      //create associated image entry
      const imageUpdate = {
        image_id: req.body.image_id,
        obituary: updatedEntry[0].id,
      };
      //check if image entry already exists
      const currentImage = await knex("deceased_bg").select("*").where({
        obituary: updatedEntry[0].id,
      });
      //if yes, update it
      if (currentImage.length !== 0) {
        await knex("deceased_bg")
          .where({
            obituary: updatedEntry[0].id,
          })
          .update(imageUpdate);
      }
      //if no, create it
      else {
        await knex("deceased_bg").insert(imageUpdate);
      }
      //find created/updated image
      image = await knex("deceased_bg").select("*").where({
        obituary: updatedEntry[0].id,
      });
    }
    //return response with created entry and image
    return res
      .status(201)
      .json({ message: "ok", updated_entry: updatedEntry[0], image: image[0] });
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
    const entryData = await knex("obituary_bg")
      .leftJoin("deceased_bg", { "deceased_bg.obituary": "obituary_bg.id" })
      .leftJoin("images_bg", { "deceased_bg.image_id": "images_bg.id" })
      .select(
        "obituary_bg.id",
        "obituary_bg.bg_version",
        "obituary_bg.name",
        "obituary_bg.years",
        "obituary_bg.obituary",
        "obituary_bg.date",
        "obituary_bg.en_id",
        "deceased_bg.image_id",
        "images_bg.url",
        "images_bg.description"
      )
      .where({ "obituary_bg.en_id": req.params.id })
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
          Key: entryData[0].url,
        }),
        { expiresIn: 120 } // 120 seconds
      );
    }
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
    const entryData = await knex.select("*").from("obituary_bg");
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    res.status(200).json(entryData);
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
    const entryData = await knex("obituary_bg")
      .where({ bg_version: true })
      .join("obituary", { "obituary_bg.en_id": "obituary.id" })
      .select(
        "obituary_bg.id",
        "obituary_bg.bg_version",
        "obituary_bg.name",
        "obituary_bg.years",
        "obituary_bg.obituary",
        "obituary_bg.date",
        "obituary_bg.en_id"
      )
      .where({ "obituary.is_draft": false });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    res.status(200).json(sortedData);
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
    const entryData = await knex("obituary_bg")
      .leftJoin("obituary", { "obituary_bg.en_id": "obituary.id" })
      .leftJoin("deceased_bg", { "deceased_bg.obituary": "obituary_bg.id" })
      .leftJoin("images_bg", { "deceased_bg.image_id": "images_bg.id" })
      .select(
        "obituary_bg.id",
        "obituary_bg.bg_version",
        "obituary_bg.name",
        "obituary_bg.years",
        "obituary_bg.obituary",
        "obituary_bg.date",
        "obituary_bg.en_id",
        "images_bg.url",
        "images_bg.description"
      )
      .where({ "obituary_bg.bg_version": true })
      .where({ "obituary.is_draft": false });
    console.log(entryData);
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
    for (let single of pastData) {
      if (single.url !== null) {
        single.src = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: "holy-trinity-image-storage",
            Key: single.url,
          }),
          { expiresIn: 120 } // 120 seconds
        );
      }
    }
    res.status(200).json(pastData);
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
    const entryData = await knex("obituary_bg")
      .where({ bg_version: true })
      .join("obituary", { "obituary_bg.en_id": "obituary.id" })
      .select("*")
      .where({ "obituary.is_draft": true });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};
