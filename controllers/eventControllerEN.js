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
      date: req.body.date,
      event_date: req.body.event_date,
      title: req.body.title,
      event_details: req.body.event_details,
      is_draft: req.body.is_draft,
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
    if (typeof req.body.is_draft !== "boolean" || !req.body.date) {
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
      date: req.body.date,
      event_date: req.body.event_date,
      title: req.body.title,
      event_details: req.body.event_details,
      is_draft: req.body.is_draft,
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

//delete function deletes the entry from both the english and the bulgarian tables because of CASCADE
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
    const entryData = await knex.select("*").from("event");

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
    const entryData = await knex
      .select("*")
      .from("event")
      .where({ is_draft: false });

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
    const entryData = await knex
      .select("*")
      .from("event")
      .where({ is_draft: false });
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

//this function no longer returns a single event but rather the 3 closest upcoming
exports.readSingleClosestUpcoming = async (req, res) => {
  try {
    const entryData = await knex
      .select("*")
      .from("event")
      .where({ is_draft: false });

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
    if (reSortedArray.length === 3) {
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
    const entryData = await knex
      .select("*")
      .from("event")
      .where({ is_draft: false });

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
    const entryData = await knex
      .select("*")
      .from("event")
      .where({ is_draft: true });

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
