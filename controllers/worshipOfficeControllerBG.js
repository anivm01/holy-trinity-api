const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
  try {
    //create worship office entry
    const newEntry = {
      title: req.body.title,
      gospel: req.body.gospel,
      epistle: req.body.epistle,
      old_testament: req.body.old_testament,
      youtube_video_id: req.body.youtube_video_id,
      date: req.body.date,
      bg_version: req.body.bg_version,
      en_id: req.body.en_id,
    };
    const result = await knex("worship_office_bg").insert(newEntry);
    const createdEntry = await knex("worship_office_bg").select("*").where({
      id: result[0],
    });

    //create associated image entry in thumbnails table
    let image = [];
    if (req.body.thumbnail_id) {
      const newImage = {
        image_id: req.body.thumbnail_id,
        worship_office: req.body.en_id,
      };
      const imageResult = await knex("thumbnails_bg").insert(newImage);
      image = await knex("thumbnails_bg").select("*").where({
        image_id: imageResult[0],
      });
    }

    //response
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
    const entryData = await knex("worship_office_bg")
      .where({ bg_version: true })
      .join("worship_office", {
        "worship_office_bg.en_id": "worship_office.id",
      })
      .select("*")
      .where({ "worship_office.is_draft": false });

    res.status(200).json(entryData);
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
    const entryData = await knex("worship_office_bg")
      .where({ bg_version: true })
      .join("worship_office", {
        "worship_office_bg.en_id": "worship_office.id",
      })
      .select("*")
      .where({ "worship_office.is_draft": true });

    res.status(200).json(entryData);
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
    existingEntry = await knex("worship_office_bg")
      .select("*")
      .where({ en_id: req.params.id });

    if (existingEntry.length === 0) {
      res.status(404).json({
        status: 404,
        message: "The entry you're trying to update doesn't exist",
      });
    }
    const entryChanges = {
      title: req.body.title,
      gospel: req.body.gospel,
      epistle: req.body.epistle,
      old_testament: req.body.old_testament,
      youtube_video_id: req.body.youtube_video_id,
      date: req.body.date,
      bg_version: req.body.bg_version,
    };

    await knex("worship_office_bg")
      .where({ en_id: req.params.id })
      .update(entryChanges);

    const updatedEntry = await knex("worship_office_bg").select("*").where({
      id: existingEntry[0].id,
    });

    let image = [];

    if (req.body.thumbnail_id) {
      const imageUpdate = {
        image_id: req.body.thumbnail_id,
        worship_office: req.params.id,
      };
      const thumbnail = await knex("thumbnails_bg").select("*").where({
        worship_office: req.params.id,
      });
      if (thumbnail.length !== 0) {
        await knex("thumbnails_bg")
          .where({ worship_office: req.params.id })
          .update(imageUpdate);
      } else {
        await knex("thumbnails_bg").insert(imageUpdate);
      }
      image = await knex("thumbnails_bg").select("*").where({
        worship_office: req.params.id,
      });
    }

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
    const existingEntry = await knex("worship_office_bg")
      .select("*")
      .where({ en_id: req.params.id });
    if (existingEntry.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Couldn't find the entry you're trying to delete",
      });
    }
    await knex("worship_office_bg").where({ id: existingEntry[0].id }).del();
    await knex("worship_office").where({ id: req.params.id }).del();
    return res.status(204).json({ status: 204, message: "Delete successful" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};
