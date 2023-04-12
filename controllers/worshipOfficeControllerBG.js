const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");
const { s3Client } = require("../utilities/s3Client.js")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { GetObjectCommand } = require("@aws-sdk/client-s3");

exports.create = async (req, res) => {
  try {
    //req verification
    if (!req.body.en_id || !req.body.date) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //create worship office entry
    const newEntry = {
      title: req.body.title,
      gospel: req.body.gospel,
      epistle: req.body.epistle,
      old_testament: req.body.old_testament,
      youtube_video_id: req.body.youtube_video_id,
      date: req.body.date,
      en_id: req.body.en_id,
    };
    const result = await knex("worship_office_bg").insert(newEntry);
    //find created entry
    const createdEntry = await knex("worship_office_bg").select("*").where({
      id: result[0],
    });

    //create associated image entry in thumbnails table
    let image = [];
    //check if image id was provided
    if (req.body.thumbnail_id) {
      //create image entry
      const newImage = {
        image_id: req.body.thumbnail_id,
        worship_office: createdEntry[0].id,
      };
      const imageResult = await knex("thumbnails_bg").insert(newImage);
      //find created image entry
      image = await knex("thumbnails_bg").select("*").where({
        image_id: imageResult[0],
      });
    }
    //send response with created entry and image
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
    if (!req.body.date) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //find existing entry
    existingEntry = await knex("worship_office_bg")
      .select("*")
      .where({ en_id: req.params.id });
    //send error if entry doesn't exist
    if (existingEntry.length === 0) {
      res.status(404).json({
        status: 404,
        message: "The entry you're trying to update doesn't exist",
      });
    }
    //update entry
    const entryChanges = {
      title: req.body.title,
      gospel: req.body.gospel,
      epistle: req.body.epistle,
      old_testament: req.body.old_testament,
      youtube_video_id: req.body.youtube_video_id,
      date: req.body.date,
    };

    await knex("worship_office_bg")
      .where({ en_id: req.params.id })
      .update(entryChanges);
    //find updated entry
    const updatedEntry = await knex("worship_office_bg").select("*").where({
      id: existingEntry[0].id,
    });
    //handle image association
    let image = [];
    //check if image id was provided
    if (req.body.thumbnail_id) {
      //create image entry
      const imageUpdate = {
        image_id: req.body.thumbnail_id,
        worship_office: updatedEntry[0].id,
      };
      //check if image entry already exists
      const thumbnail = await knex("thumbnails_bg").select("*").where({
        worship_office: updatedEntry[0].id,
      });
      //if yes update it
      if (thumbnail.length !== 0) {
        await knex("thumbnails_bg")
          .where({ worship_office: req.params.id })
          .update(imageUpdate);
      }
      //if no create it
      else {
        await knex("thumbnails_bg").insert(imageUpdate);
      }
      //find image entry
      image = await knex("thumbnails_bg").select("*").where({
        worship_office: updatedEntry[0].id,
      });
    }
    //return response with updated entry and image
    return res.status(201).json({
      message: "ok!",
      updated_entry: updatedEntry[0],
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

exports.readSingle = async (req, res) => {
  try {
    const entryData = await knex
      .select("*")
      .from("worship_office_bg")
      .where({ en_id: req.params.id });

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
    const entryData = await knex.select("*").from("worship_office_bg");
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any data.",
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
    const entryData = await knex("worship_office_bg")
      .join("worship_office", {
        "worship_office_bg.en_id": "worship_office.id",
      })
      .select(
        "worship_office_bg.id",
        "worship_office_bg.title",
        "worship_office_bg.gospel",
        "worship_office_bg.epistle",
        "worship_office_bg.old_testament",
        "worship_office_bg.youtube_video_id",
        "worship_office_bg.date",
        "worship_office_bg.en_id"
      )
      .where({ "worship_office.is_draft": false });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any data.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    return res.status(200).json(sortedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readPast = async (req, res) => {
  try {
    const entryData = await knex("worship_office_bg")
      .join("worship_office", {
        "worship_office_bg.en_id": "worship_office.id",
      })
      .leftJoin("thumbnails_bg", {
        "thumbnails_bg.worship_office": "worship_office_bg.id",
      })
      .leftJoin("images_bg", {"images_bg.en_id": "thumbnails_bg.image_id"})
      .select(
        "worship_office_bg.id",
        "worship_office_bg.title",
        "worship_office_bg.gospel",
        "worship_office_bg.epistle",
        "worship_office_bg.old_testament",
        "worship_office_bg.youtube_video_id",
        "worship_office_bg.date",
        "worship_office_bg.en_id",
        "images_bg.url",
        "images_bg.description"
      )
      .where({ "worship_office.is_draft": false })
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any data.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    const pastData = sortedData.filter((single) => {
      return single.date < req.params.date;
    });
    for (let single of pastData) {
      single.src = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: "holy-trinity-image-storage",
          Key: single.url
        }),
        { expiresIn: 120 }// 120 seconds
      )
    }
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
    const entryData = await knex("worship_office_bg")
      .join("worship_office", {
        "worship_office_bg.en_id": "worship_office.id",
      })
      .join("thumbnails_bg", {
        "thumbnails_bg.worship_office": "worship_office_bg.id",
      })
      .join("images_bg", {"images_bg.en_id": "thumbnails_bg.image_id"})
      .select(
        "worship_office_bg.id",
        "worship_office_bg.title",
        "worship_office_bg.gospel",
        "worship_office_bg.epistle",
        "worship_office_bg.old_testament",
        "worship_office_bg.youtube_video_id",
        "worship_office_bg.date",
        "worship_office_bg.en_id",
        "images_bg.url",
        "images_bg.description"
      )
      .where({ "worship_office.is_draft": false })
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any data.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    const pastData = sortedData.filter((single) => {
      return single.date < req.params.date;
    });
    pastData[0].src = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: "holy-trinity-image-storage",
        Key: pastData[0].url
      }),
      { expiresIn: 120 }// 120 seconds
    )
    return res.status(200).json(pastData[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readDrafts = async (_req, res) => {
  try {
    const entryData = await knex("worship_office_bg")
      .join("worship_office", {
        "worship_office_bg.en_id": "worship_office.id",
      })
      .select(
        "worship_office_bg.id",
        "worship_office_bg.title",
        "worship_office_bg.gospel",
        "worship_office_bg.epistle",
        "worship_office_bg.old_testament",
        "worship_office_bg.youtube_video_id",
        "worship_office_bg.date",
        "worship_office_bg.en_id"
      )
      .where({ "worship_office.is_draft": true });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any data.",
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
