const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
    try {
        //req verification
        if (!req.body.url || !req.body.text) {
            return res.status(400).json({
                status: 400,
                message: "Bad request. Required information is missing.",
            });
        }

        //create new entry
        const newEntry = {
            text: req.body.text,
            url: req.body.url,
        };

        //check if this date has an associated entry
        existingEntry = await knex("resources")
            .select("*")
            .where({ url: req.body.url });

        if (existingEntry.length > 0) {
            await knex("resources").where({ id: existingEntry[0].id }).update(newEntry);
            //find updated entry
            const updatedEntry = await knex("resources").select("*").where({
                url: req.body.url,
            });
            //return response with updated entry
            return res.status(201).json(updatedEntry[0]);
        }

        //if this date has no associated entry, create it
        const result = await knex("resources").insert(newEntry);
        //find new entry
        const createdEntry = await knex("resources").select("*").where({
            id: result[0],
        });
        //return a response with new entry
        return res.status(201).json({ message: "ok!", new_entry: createdEntry[0] });
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
        if (!req.body.url || !req.body.text) {
            return res.status(400).json({
                status: 400,
                message: "Bad request. Required information is missing.",
            });
        }

        //find entry being updated
        existingEntry = await knex("resources")
            .select("*")
            .where({ id: req.params.id });
        //return error if it doesn't exist
        if (existingEntry.length === 0) {
            res.status(404).json({
                status: 404,
                message: "The entry you're trying to update doesn't exist",
            });
        }
        //apply update
        const entryChanges = {
            text: req.body.text,
            url: req.body.url,
        };
        await knex("resources").where({ id: req.params.id }).update(entryChanges);
        //find updated entry
        const updatedEntry = await knex("resources").select("*").where({
            id: req.params.id,
        });
        //return response with updated entry
        return res.status(201).json(updatedEntry[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            message: "Unable to update the entry",
            error: error,
        });
    }
};

//delete function deletes the entry from both the english and the bulgarian tables because of CASCADE
exports.deleteSingle = async (req, res) => {
    try {
        const existingEntry = await knex("resources")
            .select("*")
            .where({ id: req.params.id });
        if (existingEntry.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Couldn't find the entry you're trying to delete",
            });
        }
        await knex("resources").where({ id: req.params.id }).del();
        return res.status(204).json({ status: 204, message: "Delete successful" });
    } catch (error) {
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
            .from("resources")
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
        const entryData = await knex.select("*").from("resources").orderBy('created_at', 'desc')
        if (entryData.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Not Found: Couldn't find any entries.",
            });
        }
        return res.status(200).json(entryData);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "There was an issue with the database",
            error: error,
        });
    }
};




