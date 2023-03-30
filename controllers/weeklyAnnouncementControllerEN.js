const { sortNewestToOldest } = require("../utilities/sort.js");

const knex = require("knex")(require("../knexfile"));

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
    const newAnnouncement = req.body;
    const result = await knex("weekly_announcement").insert(newAnnouncement);
    //find new entry
    const createdAnnouncement = await knex("weekly_announcement")
      .select("*")
      .where({
        id: result[0],
      });
    //return response with new entry
    return res
      .status(201)
      .json({ message: "ok!", new_entry: createdAnnouncement[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Couldn't create new announcement",
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
    //find existing entry
    const existingAnnouncement = await knex("weekly_announcement")
      .select("*")
      .where({
        id: req.params.id,
      });
    //send error if entry doesn't exist
    if (existingAnnouncement.length === 0) {
      res.status(404).json({
        status: 404,
        message: "The entry you're trying to update doesn't exist",
      });
    }
    //update entry
    const announcementChanges = req.body;
    await knex("weekly_announcement")
      .where({ id: req.params.id })
      .update(announcementChanges);
    //find updated entry
    const updatedAnnouncement = await knex("weekly_announcement")
      .select("*")
      .where({
        id: req.params.id,
      });
    //send response with unpdated entry
    return res.status(201).json(updatedAnnouncement[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Unable to update the announcement",
      error: error,
    });
  }
};

//delete function deletes the announcement from both the english and the bulgarian tables because of CASCADE

exports.deleteSingle = async (req, res) => {
  try {
    const verify = await knex("weekly_announcement")
      .select("*")
      .where({ id: req.params.id });
    if (verify.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Couldn't find the announcement you're trying to delete",
      });
    }
    await knex("weekly_announcement").where({ id: req.params.id }).del();
    return res.status(204).json({ status: 204, message: "Delete successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readSingle = async (req, res) => {
  try {
    const announcementData = await knex
      .select("*")
      .from("weekly_announcement")
      .where({ id: req.params.id });
    if (announcementData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Coundn't find the announcement you were looking for",
      });
    }
    return res.json(announcementData[0]);
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
    const announcementData = await knex.select("*").from("weekly_announcement");
    if (announcementData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any announcements.",
      });
    }

    const sortedData = sortNewestToOldest(announcementData);
    res.status(200).json(sortedData);
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
    const announcementData = await knex
      .select("*")
      .from("weekly_announcement")
      .where({ is_draft: false });
    if (announcementData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any announcements.",
      });
    }
    const sortedData = sortNewestToOldest(announcementData);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readSingleMostRecent = async (req, res) => {
  try {
    const announcementData = await knex
      .select("*")
      .from("weekly_announcement")
      .where({ is_draft: false });
    if (announcementData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any announcements.",
      });
    }
    const sortedData = sortNewestToOldest(announcementData);
    const processedData = sortedData.filter((single) => {
      return single.date < req.params.date;
    });

    res.status(200).json(processedData[0]);
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
    const announcementData = await knex
      .select("*")
      .from("weekly_announcement")
      .where({ is_draft: true });
    if (announcementData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any announcements.",
      });
    }
    const sortedData = sortNewestToOldest(announcementData);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};
