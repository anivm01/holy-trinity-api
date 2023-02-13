const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
    try {
      if (
        !req.body.name ||
        !req.body.years ||
        !req.body.obituary ||
        !req.body.image_id
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Some required information is missing",
        });
      }
  
      const newEntry = req.body;
      const result = await knex("obituary").insert(newEntry);
      const createdEntry = await knex("obituary").select("*").where({
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
        .from("obituary")
        .where({ id: req.params.id });
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
  
  exports.updateSingle = async (req, res) => {

    try {
      if (
        !req.body.name ||
        !req.body.years ||
        !req.body.obituary ||
        !req.body.image_id
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Some required information is missing",
        });
      }
      existingEntry = await knex("obituary").select("*")
        .where({ id: req.params.id })
  
      if(existingEntry.length===0){
          res.status(404).json({
              status: 404,
              message:
                "The entry you're trying to update doesn't exist",
            });
      }
      const entryChanges = req.body;
  
      await knex("obituary")
        .where({ id: req.params.id })
        .update(entryChanges);
  
      const updatedEntry = await knex("obituary").select("*").where({
        id: req.params.id,
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
  
  //delete function deletes the announcement from both the english and the bulgarian tables because of CASCADE
  
  exports.deleteSingle = async (req, res) => {
      try {
          const existingEntry = await knex("obituary").select("*").where({id: req.params.id})
          if (existingEntry.length === 0) {
              return res.status(404).json({ status: 404, message: "Couldn't find the entry you're trying to delete"})
          }
          await knex("obituary").where({id: req.params.id}).del()
          return res.status(204)
      }
      catch (error) {
          return res.status(500).json({ status: 500, message: "There was an issue with the database", error:error})
      }
  }