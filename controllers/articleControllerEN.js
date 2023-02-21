const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
    try {
      if (
        !req.body.title ||
        !req.body.content ||
        !req.body.date_posted ||
        !req.body.featured_img_id
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Some required information is missing",
        });
      }
  
      const newEntry = req.body;
      const result = await knex("article").insert(newEntry);
      const createdEntry = await knex("article").select("*").where({
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
        .from("article")
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

      const entryData = await knex.select("*").from("article");

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
        !req.body.title ||
        !req.body.content ||
        !req.body.date_posted ||
        !req.body.featured_img_id
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Some required information is missing",
        });
      }
      existingEntry = await knex("article").select("*")
        .where({ id: req.params.id })
  
      if(existingEntry.length===0){
          res.status(404).json({
              status: 404,
              message:
                "The entry you're trying to update doesn't exist",
            });
      }
      const entryChanges = req.body;
  
      await knex("article")
        .where({ id: req.params.id })
        .update(entryChanges);
  
      const updatedEntry = await knex("article").select("*").where({
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
          const existingEntry = await knex("article").select("*").where({id: req.params.id})
          if (existingEntry.length === 0) {
              return res.status(404).json({ status: 404, message: "Couldn't find the entry you're trying to delete"})
          }
          await knex("article").where({id: req.params.id}).del()
          return res.status(204).json({ status: 204, message: "Delete successful"})
      }
      catch (error) {
          return res.status(500).json({ status: 500, message: "There was an issue with the database", error:error})
      }
  }