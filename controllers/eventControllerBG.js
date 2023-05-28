const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");

exports.create = async (req, res) => {
  try {
    //req verification
    if (!req.body.en_id || !req.body.date) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //create new entry
    const newEntry = {
      date: req.body.date,
      event_date: req.body.event_date,
      title: req.body.title,
      event_details: req.body.event_details,
      en_id: req.body.en_id,
    };
    const result = await knex("event_bg").insert(newEntry);
    //find created entry
    const createdEntry = await knex("event_bg").select("*").where({
      id: result[0],
    });
    //return response with created entry
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
    if (typeof req.body.bg_version !== "boolean" || !req.body.date) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //find existing entry
    existingEntry = await knex("event_bg")
      .select("*")
      .where({ en_id: req.params.id });
    //send error if it doesn't exist
    if (existingEntry.length === 0) {
      res.status(404).json({
        status: 404,
        message: "The entry you're trying to update doesn't exist",
      });
    }
    //update existing entry
    const entryChanges = {
      date: req.body.date,
      event_date: req.body.event_date,
      title: req.body.title,
      event_details: req.body.event_details,
    };

    await knex("event_bg")
      .where({ id: existingEntry[0].id })
      .update(entryChanges);
    //find updated entry
    const updatedEntry = await knex("event_bg").select("*").where({
      id: existingEntry[0].id,
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
        "event_bg.id"
      )
      .innerJoin("event", { "event.id": "event_bg.en_id" })
      .where({ "event.is_draft": false });

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
        "event_bg.id"
      )
      .innerJoin("event", { "event.id": "event_bg.en_id" })
      .where({ "event.is_draft": false });

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
        "event_bg.id"
      )
      .innerJoin("event", { "event.id": "event_bg.en_id" })
      .where({ "event.is_draft": false });

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
    let upcomingEventsToDisplay = [];
    if (reSortedArray.length >= 3) {
      upcomingEventsToDisplay = [
        reSortedArray[0],
        reSortedArray[1],
        reSortedArray[2],
      ];
    }
    if (reSortedArray.length === 2) {
      upcomingEventsToDisplay = [reSortedArray[0], reSortedArray[1]];
    }
    if (reSortedArray.length === 1) {
      upcomingEventsToDisplay = [reSortedArray[0]];
      if (reSortedArray.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Not Found: Couldn't find any entries.",
        });
      }
    }
    return res.status(200).json(upcomingEventsToDisplay);
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
        "event_bg.id"
      )
      .innerJoin("event", { "event.id": "event_bg.en_id" })
      .where({ "event.is_draft": false });

    if (entryData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any entries.",
      });
    }
    const sortedData = entryData.sort((a, b) => {
      return new Date(b.event_date) - new Date(a.event_date);
    });
    const pastData = sortedData.filter((single) => {
      return single.event_date < req.params.date;
    });
    const latestData = pastData.slice(0, 5);
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
