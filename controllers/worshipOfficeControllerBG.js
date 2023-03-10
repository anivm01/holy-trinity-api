const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
  try {
    if (
      !req.body.en_id
    ) {
      return res.status(400).json({
        status: 400,
        message:
          "Some required information is missing",
      });
    }

    const newEntry = req.body;
    const result = await knex("worship_office_bg").insert(newEntry);
    const createdEntry = await knex("worship_office_bg").select("*").where({
      id: result[0],
    });
    return res
      .status(201)
      .json({ message: "ok!", new_entry: createdEntry[0] });
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
      .from("worship_office_bg")
      .where({ en_id: req.params.id });
    if (entryData.length === 0) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "Coundn't find the entry you were looking for",
        });
    }
    return res.json(entryData[0]);
  } catch (error) {
    return res
      .status(500)
      .json({
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
    const entryData = await knex("worship_office_bg").where({bg_version: true}).join("worship_office", {"worship_office_bg.en_id": "worship_office.id"}).select("*").where({"worship_office.is_draft": false});

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
    existingEntry = await knex("worship_office_bg").select("*")
      .where({ en_id: req.params.id })

    if(existingEntry.length===0){
        res.status(404).json({
            status: 404,
            message:
              "The entry you're trying to update doesn't exist",
          });
    }
    const entryChanges = req.body;

    await knex("worship_office_bg")
      .where({ id: existingEntry[0].id })
      .update(entryChanges);

    const updatedEntry = await knex("worship_office_bg").select("*").where({
      id: existingEntry[0].id,
    });

    return res.status(201).json(updatedEntry[0]);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Unable to update the entry",
        error: error,
      });
  }
};

exports.deleteSingle = async (req, res) => {
    try {
        const existingEntry = await knex("worship_office_bg").select("*").where({en_id: req.params.id})
        if (existingEntry.length === 0) {
            return res.status(404).json({ status: 404, message: "Couldn't find the entry you're trying to delete"})
        }
        await knex("worship_office_bg").where({id: existingEntry[0].id}).del()
        await knex("worship_office").where({id: req.params.id}).del()
        return res.status(204).json({ status: 204, message: "Delete successful"})
    }
    catch (error) {
        return res.status(500).json({ status: 500, message: "There was an issue with the database", error:error})
    }
}