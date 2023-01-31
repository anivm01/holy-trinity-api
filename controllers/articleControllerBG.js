exports.create = async (req, res) => {
    try {
      if (
        !req.body.title ||
        !req.body.content ||
        !req.body.date_posted ||
        !req.body.featured_img_id ||
        !req.body.en_id
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Some required information is missing",
        });
      }
  
      const newEntry = req.body;
      const result = await knex("article_bg").insert(newEntry);
      const createdEntry = await knex("article_bg").select("*").where({
        id: result[0],
      });
      return res
        .status(201)
        .json({ message: "ok!", new_entry: createdEntry });
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
        .from("article_bg")
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
      const entryData = await knex.select("*").from("article_bg");
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
        !req.body.en_id ||
        !req.body.image_id
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Some required information is missing",
        });
      }
      existingEntry = await knex("article_bg").select("*")
        .where({ en_id: req.params.id })
  
      if(existingEntry.length===0){
          res.status(404).json({
              status: 404,
              message:
                "The entry you're trying to update doesn't exist",
            });
      }
      const entryChanges = req.body;
  
      await knex("article_bg")
        .where({ id: existingEntry[0].id })
        .update(entryChanges);
  
      const updatedEntry = await knex("article_bg").select("*").where({
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
          const existingEntry = await knex("article_bg").select("*").where({en_id: req.params.id})
          if (existingEntry.length === 0) {
              return res.status(404).json({ status: 404, message: "Couldn't find the entry you're trying to delete"})
          }
          await knex("article_bg").where({id: existingEntry[0].id}).del()
          await knex("article").where({id: req.params.id}).del()
          return res.status(204)
      }
      catch (error) {
          return res.status(500).json({ status: 500, message: "There was an issue with the database", error:error})
      }
  }