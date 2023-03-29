const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");

exports.create = async (req, res) => {
  try {
    if (!req.body.en_id) {
      return res.status(400).json({
        status: 400,
        message: "Some required information is missing",
      });
    }

    const newEntry = req.body;
    const result = await knex("event_bg").insert(newEntry);
    const createdEntry = await knex("event_bg").select("*").where({
      id: result[0],
    });
    return res.status(201).json({ message: "ok!", new_entry: createdEntry[0] });
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
      .from("event_bg")
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
    const entryData = await knex.select("*").from("event_bg");
    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    return res.status(200).json(sortedData);
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
    const entryData = await knex("event_bg")
      .select(
        "event_bg.title",
        "event_bg.event_details",
        "event_bg.event_date",
        "event_bg.date",
        "event_bg.en_id",
        "event_bg.id",
        "event_bg.bg_version"
      )
      .innerJoin("event", { "event.id": "event_bg.en_id" })
      .where({ "event.is_draft": false })
      .where({ "event_bg.bg_version": true });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    return res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readUpcoming = async (req, res) => {
  try {
    const entryData = await knex("event_bg")
      .select(
        "event_bg.title",
        "event_bg.event_details",
        "event_bg.event_date",
        "event_bg.date",
        "event_bg.en_id",
        "event_bg.id",
        "event_bg.bg_version"
      )
      .innerJoin("event", { "event.id": "event_bg.en_id" })
      .where({ "event.is_draft": false })
      .where({ "event_bg.bg_version": true });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    const upcomingData = sortedData.filter((single) => {
      return single.event_date > req.params.date;
    });
    const reSortedArray = upcomingData.sort((a, b) => {
      return new Date(a.event_date) - new Date(b.event_date);
    });
    return res.status(200).json(reSortedArray);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readSingleClosestUpcoming = async (req, res) => {
  try {
    const entryData = await knex("event_bg")
      .select(
        "event_bg.title",
        "event_bg.event_details",
        "event_bg.event_date",
        "event_bg.date",
        "event_bg.en_id",
        "event_bg.id",
        "event_bg.bg_version"
      )
      .innerJoin("event", { "event.id": "event_bg.en_id" })
      .where({ "event.is_draft": false })
      .where({ "event_bg.bg_version": true });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    const upcomingData = sortedData.filter((single) => {
      return single.event_date > req.params.date;
    });
    const reSortedArray = upcomingData.sort((a, b) => {
      return new Date(a.event_date) - new Date(b.event_date);
    });
    return res.status(200).json(reSortedArray[0]);
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
    const entryData = await knex("event_bg")
      .select(
        "event_bg.title",
        "event_bg.event_details",
        "event_bg.event_date",
        "event_bg.date",
        "event_bg.en_id",
        "event_bg.id",
        "event_bg.bg_version"
      )
      .innerJoin("event", { "event.id": "event_bg.en_id" })
      .where({ "event.is_draft": false })
      .where({ "event_bg.bg_version": true });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = entryData.sort( (a,b) => {
      return new Date(b.event_date) - new Date(a.event_date);
  })
    const pastData = sortedData.filter((single) => {
      return single.event_date < req.params.date;
    });
    const latestData = pastData.slice(0, 5)
    return res.status(200).json(latestData);
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
    const entryData = await knex("event_bg")
      .where({ bg_version: true })
      .join("event", { "event_bg.en_id": "event.id" })
      .select("*")
      .where({ "event.is_draft": true });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = sortNewestToOldest(entryData);
    return res.status(200).json(sortedData);
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
    existingEntry = await knex("event_bg")
      .select("*")
      .where({ en_id: req.params.id });

    if (existingEntry.length === 0) {
      res.status(404).json({
        status: 404,
        message: "The entry you're trying to update doesn't exist",
      });
    }
    const entryChanges = req.body;

    await knex("event_bg")
      .where({ id: existingEntry[0].id })
      .update(entryChanges);

    const updatedEntry = await knex("event_bg").select("*").where({
      id: existingEntry[0].id,
    });

    return res.status(201).json(updatedEntry[0]);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Unable to update the entry",
      error: error,
    });
  }
};

exports.deleteSingle = async (req, res) => {
  try {
    const existingEntry = await knex("event_bg")
      .select("*")
      .where({ en_id: req.params.id });
    if (existingEntry.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Couldn't find the entry you're trying to delete",
      });
    }
    await knex("event_bg").where({ id: existingEntry[0].id }).del();
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
