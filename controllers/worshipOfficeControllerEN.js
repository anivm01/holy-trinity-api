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
    //create new worship office entry
    const newEntry = {
      title: req.body.title,
      gospel: req.body.gospel,
      epistle: req.body.epistle,
      old_testament: req.body.old_testament,
      youtube_video_id: req.body.youtube_video_id,
      date: req.body.date,
      is_draft: req.body.is_draft,
    };
    const result = await knex("worship_office").insert(newEntry);
    //find newly created entry
    const createdEntry = await knex("worship_office").select("*").where({
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
      const imageResult = await knex("thumbnails").insert(newImage);
      //find created image entry
      image = await knex("thumbnails").select("*").where({
        image_id: imageResult[0],
      });
    }
    //return response with created entry and image entry
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
    if (typeof req.body.is_draft !== "boolean" || !req.body.date) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //find existing entry
    existingEntry = await knex("worship_office")
      .select("*")
      .where({ id: req.params.id });
    //return error if entry doesn't exist
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
      is_draft: req.body.is_draft,
    };

    await knex("worship_office")
      .where({ id: req.params.id })
      .update(entryChanges);
    //find updated entry
    const updatedEntry = await knex("worship_office").select("*").where({
      id: req.params.id,
    });
    //handle image association
    let image = [];
    //check if image id was provided
    if (req.body.thumbnail_id) {
      //create associated image entry
      const imageUpdate = {
        image_id: req.body.thumbnail_id,
        worship_office: req.params.id,
      };
      //check if associate image already exists
      const thumbnail = await knex("thumbnails").select("*").where({
        worship_office: req.params.id,
      });
      //if yes, update it
      if (thumbnail.length !== 0) {
        await knex("thumbnails")
          .where({ worship_office: req.params.id })
          .update(imageUpdate);
      }
      //if no create it
      else {
        await knex("thumbnails").insert(imageUpdate);
      }
      //find associated image entry
      image = await knex("thumbnails").select("*").where({
        worship_office: req.params.id,
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

exports.deleteSingle = async (req, res) => {
  try {
    const existingEntry = await knex("worship_office")
      .select("*")
      .where({ id: req.params.id });
    if (existingEntry.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Couldn't find the entry you're trying to delete",
      });
    }
    await knex("worship_office").where({ id: req.params.id }).del();
    return res.status(204).json({ status: 204, message: "Delete successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readSingle = async (req, res) => {
  try {
    const entryData = await knex
      .select("*")
      .from("worship_office")
      .where({ id: req.params.id });

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
    const entryData = await knex.select("*").from("worship_office");
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
    const entryData = await knex
      .select("*")
      .from("worship_office")
      .where({ is_draft: false });
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

exports.readPast = async (req, res) => {
  try {
    const entryData = await knex("worship_office")
      .leftJoin("thumbnails", { "thumbnails.worship_office": "worship_office.id" })
      .leftJoin("images", {"images.id": "thumbnails.image_id"})
      .select(
        "worship_office.id",
        "worship_office.title",
        "worship_office.gospel",
        "worship_office.epistle",
        "worship_office.old_testament",
        "worship_office.youtube_video_id",
        "worship_office.date",
        "images.url",
        "images.description"
      )
      .where({ is_draft: false });
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
    const entryData = await knex("worship_office")
      .leftJoin("thumbnails", { "thumbnails.worship_office": "worship_office.id" })
      .leftJoin("images", {"images.id": "thumbnails.image_id"})
      .select(
        "worship_office.id",
        "worship_office.title",
        "worship_office.gospel",
        "worship_office.epistle",
        "worship_office.old_testament",
        "worship_office.youtube_video_id",
        "worship_office.date",
        "images.url",
        "images.description"
      )
      .where({ is_draft: false });
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
    if(pastData[0].url !== null) {
      pastData[0].src = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: "holy-trinity-image-storage",
          Key: pastData[0].url
        }),
        { expiresIn: 120 }// 120 seconds
      )
    }
    return res.status(200).json(pastData[0]);
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
      .from("worship_office")
      .where({ is_draft: true });
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
