const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
    try {
        //req verification
        if (!req.body.event_date) {
            return res.status(400).json({
                status: 400,
                message: "Bad request. Required information is missing.",
            });
        }
        //create new entry
        const newEntry = {
            event_date: req.body.event_date,
            title: req.body.title,
            title_bg: req.body.title_bg,
            is_default: req.body.is_default,
            event_details: !req.body.is_default && req.body.event_details,
            event_details_bg: !req.body.is_default && req.body.event_details_bg,
        };
        const result = await knex("event").insert(newEntry);
        //find new entry
        const createdEntry = await knex("event").select("*").where({
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
        if (!req.body.event_date) {
            return res.status(400).json({
                status: 400,
                message: "Bad request. Required information is missing.",
            });
        }
        //find entry being updated
        existingEntry = await knex("event")
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
            event_date: req.body.event_date,
            title: req.body.title,
            title_bg: req.body.title_bg,
            is_default: req.body.is_default,
            event_details: !req.body.is_default && req.body.event_details,
            event_details_bg: !req.body.is_default && req.body.event_details_bg,
        };
        await knex("event").where({ id: req.params.id }).update(entryChanges);
        //find updated entry
        const updatedEntry = await knex("event").select("*").where({
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

exports.deleteSingle = async (req, res) => {
    try {
        const existingEntry = await knex("event")
            .select("*")
            .where({ id: req.params.id });
        if (existingEntry.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Couldn't find the entry you're trying to delete",
            });
        }
        await knex("event").where({ id: req.params.id }).del();
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
            .from("event")
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
        const entryData = await knex.select("*").from("event").orderBy("event_date", "desc");
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

exports.readUpcoming = async (req, res) => {
    const requestDate = req.params.date; // Get the date from the route parameter
    try {
        // Convert the provided date to a UNIX timestamp

        // Query the database for the next 10 events after the given date
        const upcomingEvents = await knex('event')
            .where('event_date', '>', requestDate)
            .orderBy('event_date', 'asc')
            .limit(10);
        if (upcomingEvents.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Not Found: Couldn't find any upcoming events.",
            });
        }
        return res.status(200).json(upcomingEvents);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "There was an issue with the database",
            error: error,
        });
    }
};
