const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");

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
      name: req.body.name,
      obituary: req.body.obituary,
      years: req.body.years,
      date: req.body.date,
      is_draft: req.body.is_draft,
    };
    const result = await knex("obituary").insert(newEntry);
    //find newly created entry
    const createdEntry = await knex("obituary").select("*").where({
      id: result[0],
    });

    //create image association
    let image = [];
    //check if image id was provided
    if (req.body.image_id) {
      //create associated image entry
      const newImage = {
        image_id: req.body.image_id,
        obituary: createdEntry[0].id,
      };
      const imageResult = await knex("deceased").insert(newImage);
      //find associated image entry
      image = await knex("deceased").select("*").where({
        id: imageResult[0],
      });
    }
    //return response with newly created entry and possibly image
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
    existingEntry = await knex("obituary")
      .select("*")
      .where({ id: req.params.id });
    //return error if entry doesn't exist
    if (existingEntry.length === 0) {
      res.status(404).json({
        status: 404,
        message: "The entry you're trying to update doesn't exist",
      });
    }
    //update existing entry
    const entryChanges = {
      name: req.body.name,
      obituary: req.body.obituary,
      years: req.body.years,
      date: req.body.date,
      is_draft: req.body.is_draft,
    };
    await knex("obituary").where({ id: req.params.id }).update(entryChanges);
    //find updated entry
    const updatedEntry = await knex("obituary").select("*").where({
      id: req.params.id,
    });
    //update associated image
    let image = [];
    //check if image id was provided
    if (req.body.image_id) {
      //create image entry
      const imageUpdate = {
        image_id: req.body.image_id,
        obituary: req.params.id,
      };
      //check if image entry already exists
      const currentImage = await knex("deceased").select("*").where({
        obituary: req.params.id,
      });
      //if yes, update it
      if (currentImage.length !== 0) {
        await knex("deceased")
          .where({
            obituary: req.params.id,
          })
          .update(imageUpdate);
      }
      //if no, create it
      else {
        await knex("deceased").insert(imageUpdate);
      }
      //find newly created or updated image
      image = await knex("deceased").select("*").where({
        obituary: req.params.id,
      });
    }
    //return updated entry and possibly image
    return res
      .status(201)
      .json({ message: "ok", updated_entry: updatedEntry[0], image: image[0] });
  } catch (error) {
    console.log(error)
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
    const existingEntry = await knex("obituary")
      .select("*")
      .where({ id: req.params.id });
    if (existingEntry.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Couldn't find the entry you're trying to delete",
      });
    }
    await knex("obituary").where({ id: req.params.id }).del();
    return res.status(204).json({ status: 204, message: "Delete successful" });
  } catch (error) {
    console.log(error)
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
      .from("obituary")
      .where({ id: req.params.id });
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
    const entryData = await knex.select("*").from("obituary");

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
    const entryData = await knex
      .select("*")
      .from("obituary")
      .where({ is_draft: false });

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
    const entryData = await knex
      .select("*")
      .from("obituary")
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
    const entryData = await knex
      .select("*")
      .from("obituary")
      .where({ is_draft: true });

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
