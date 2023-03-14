const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
  try {
    if (!req.body.en_id) {
      return res.status(400).json({
        status: 400,
        message: "Some required information is missing",
      });
    }
    const newEntry = {
      name: req.body.name,
      obituary: req.body.obituary,
      years: req.body.years,
      date: req.body.date,
      bg_version: req.body.bg_version,
      en_id: req.body.en_id,
    };
    const result = await knex("obituary_bg").insert(newEntry);
    const createdEntry = await knex("obituary_bg").select("*").where({
      id: result[0],
    });

    let image = [];
    if (req.body.image_id) {
      const newImage = {
        image_id: req.body.image_id,
        obituary: createdEntry[0].id,
      };
      const imageResult = await knex("deceased_bg").insert(newImage);
      image = await knex("deceased_bg").select("*").where({
        id: imageResult[0],
      });
    }
    return res
      .status(201)
      .json({ message: "ok!", new_entry: createdEntry[0], image: image[0] });
  } catch (error) {
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
      .from("obituary_bg")
      .where({ en_id: req.params.id });
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Coundn't find the entry you were looking for",
      });
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
    existingEntry = await knex("obituary_bg")
      .select("*")
      .where({ en_id: req.params.id });

    if (existingEntry.length === 0) {
      res.status(404).json({
        status: 404,
        message: "The entry you're trying to update doesn't exist",
      });
    }
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

    const updatedEntry = await knex("obituary_bg").select("*").where({
      en_id: req.params.id,
    });

    let image = [];
    if (req.body.image_id) {
      const imageUpdate = {
        image_id: req.body.image_id,
        obituary: req.params.id,
      };
      const currentImage = await knex("deceased_bg").select("*").where({
        obituary: req.params.id,
      });
      if (currentImage.length !== 0) {
        await knex("deceased_bg")
          .where({
            obituary: req.params.id,
          })
          .update(imageUpdate);
      } else {
        await knex("deceased_bg").insert(imageUpdate);
      }
      image = await knex("deceased_bg").select("*").where({
        obituary: req.params.id,
      });
    }

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

exports.deleteSingle = async (req, res) => {
  try {
    const existingEntry = await knex("obituary_bg")
      .select("*")
      .where({ en_id: req.params.id });
    if (existingEntry.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Couldn't find the entry you're trying to delete",
      });
    }
    await knex("obituary_bg").where({ id: existingEntry[0].id }).del();
    await knex("obituary").where({ id: req.params.id }).del();
    return res.status(204).json({ status: 204, message: "Delete successful" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};
