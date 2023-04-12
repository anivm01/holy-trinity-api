const knex = require("knex")(require("../knexfile"));
const { sortNewestToOldest } = require("../utilities/sort.js");

exports.create = async (req, res) => {
  try {
    //req verification
    if (
      typeof req.body.bg_version !== "boolean" ||
      !req.body.en_id ||
      !req.body.date
    ) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //create new entry
    const newAnnouncement = {
      date: req.body.date,
      title: req.body.title,
      announcement: req.body.announcement,
      bg_version: req.body.bg_version,
      en_id: req.body.en_id
    };
    const result = await knex("weekly_announcement_bg").insert(newAnnouncement);
    //find created entry
    const createdAnnouncement = await knex("weekly_announcement_bg").where({
      id: result[0],
    });
    //send response with created entry
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
    if (typeof req.body.bg_version !== "boolean" || !req.body.date) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Required information is missing.",
      });
    }
    //find existing entry
    const existingAnnouncement = await knex("weekly_announcement_bg")
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
    const announcementChanges = {
      date: req.body.date,
      title: req.body.title,
      announcement: req.body.announcement,
      bg_version: req.body.bg_version
    };
    await knex("weekly_announcement_bg")
      .where({ en_id: req.params.id })
      .update(announcementChanges);
    //find updated entry
    const updatedAnnouncement = await knex("weekly_announcement_bg")
      .select("*")
      .where({
        id: req.params.id,
      });
    //return response with updated entry
    return res.status(201).json(updatedAnnouncement[0]);
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      message: "Unable to update the announcement",
      error: error,
    });
  }
};

exports.readSingle = async (req, res) => {
  try {
    const announcementData = await knex
      .select("*")
      .from("weekly_announcement_bg")
      .where({ en_id: req.params.id });
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
    const announcementData = await knex
      .select("*")
      .from("weekly_announcement_bg");
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
    const announcementData = await knex("weekly_announcement_bg")
      .where({ bg_version: true })
      .join("weekly_announcement", {
        "weekly_announcement_bg.en_id": "weekly_announcement.id",
      })
      .select(
        "weekly_announcement_bg.id",
        "weekly_announcement_bg.title",
        "weekly_announcement_bg.announcement",
        "weekly_announcement_bg.date",
        "weekly_announcement_bg.bg_version",
        "weekly_announcement_bg.en_id"
      )
      .where({ "weekly_announcement.is_draft": false });

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
    const announcementData = await knex("weekly_announcement_bg")
      .where({ bg_version: true })
      .join("weekly_announcement", {
        "weekly_announcement_bg.en_id": "weekly_announcement.id",
      })
      .select(
        "weekly_announcement_bg.id",
        "weekly_announcement_bg.title",
        "weekly_announcement_bg.announcement",
        "weekly_announcement_bg.date",
        "weekly_announcement_bg.bg_version",
        "weekly_announcement_bg.en_id"
      )
      .where({ "weekly_announcement.is_draft": false });

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
    const announcementData = await knex("weekly_announcement_bg")
      .where({ bg_version: true })
      .join("weekly_announcement", {
        "weekly_announcement_bg.en_id": "weekly_announcement.id",
      })
      .select("*")
      .where({ "weekly_announcement.is_draft": true });

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
