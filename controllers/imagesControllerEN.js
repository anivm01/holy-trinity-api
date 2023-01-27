const knex = require("knex")(require("../knexfile"));

  
exports.create = async (req, res) => {
    try {
        console.log(req.body)
        if ( !req.body.description || !req.body.descriptionBG ) {
            return res.status(400).json({
            status: 400,
            message:
                "Make sure to provide a description",
            });
        } 
        const newImageEN = {description: req.body.description, url: `/images/${req.file.filename}`};
        const resultEN = await knex("images").insert(newImageEN);
        const createdImageEN = await knex("images").select("*").where({id: resultEN[0]});

        const newImageBG = {description: req.body.descriptionBG, url: `/images/${req.file.filename}`, en_id: createdImageEN.id}
        const resultBG = await knex("images_bg").insert(newImageBG);
        const createdImageBG = await knex("images_bg").select("*").where({id: resultBG[0]});

        return res
            .status(201)
            .json({ message: "ok!", new_image_en: createdImageEN, new_image_bg: createdImageBG });
        } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Something went wrong with the database",
            error: error,
        });
        }  
}

exports.readAll = async (_req, res) => {
    try {
        const imagesData = await knex.select("*").from("images");
        if (imagesData.length === 0) {
          return res.status(404).json({
            status: 404,
            message: "Not Found: Couldn't find any images.",
          });
        }
        res.status(200).json(imagesData);
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "There was an issue with the database",
          error: error,
        });
      }
}

exports.readSingle = async (req, res) => {
    try {
        const imageData = await knex
          .select("*")
          .from("images")
          .where({ id: req.params.id });
        if (imageData.length === 0) {
          return res
            .status(404)
            .json({
              status: 404,
              message: "Coundn't find the image you were looking for",
            });
        }
        return res.json(imageData[0]);
      } catch (error) {
        return res
          .status(500)
          .json({
            status: 500,
            message: "There was an issue with the database",
            error: error,
          });
      }
}

exports.updateSingle = async (req, res) => {
    try {
        if(!req.body.description) {
            return res
            .status(400)
            .json({
              status: 400,
              message: "Make sure to provide a description",
            });
        }
        const imageData = await knex
          .select("*")
          .from("images")
          .where({ id: req.params.id });
        if (imageData.length === 0) {
          return res
            .status(404)
            .json({
              status: 404,
              message: "Coundn't find the image you were looking for",
            });
        }
        const imageChanges = req.body.description;
        await knex("images")
          .where({ id: req.params.id })
          .update({description: imageChanges});
    
        const updatedImage = await knex("images").select("*").where({
          id: req.params.id,
        });
    
        return res.status(201).json(updatedImage[0]);

      } catch (error) {
        return res
          .status(500)
          .json({
            status: 500,
            message: "Unable to update the image",
            error: error,
          });
      }
}

exports.deleteSingle = async (req, res) => {
    try {
        const imageData = await knex
        .select("*")
        .from("images")
        .where({ id: req.params.id });
        if (imageData.length === 0) {
            return res
            .status(404)
            .json({
                status: 404,
                message: "Coundn't find the image you were looking for",
            });
        }
        await knex("images").where({id: req.params.id}).del()
        return res.status(204)
    }
    catch (error) {
        return res.status(500).json({ status: 500, message: "There was an issue with the database", error:error})
    }
}