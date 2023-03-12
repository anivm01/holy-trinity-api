const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
  try {
    if (!req.body.en_id) {
      return res.status(400).json({
        status: 400,
        message:
          "Make sure to provide a title, announcement content and the date and the english version id",
      });
    }

    const newAnnouncement = req.body;
    const result = await knex("weekly_announcement_bg").insert(newAnnouncement);
    const createdAnnouncement = await knex("weekly_announcement_bg").where({
      id: result[0],
    });
    return res
      .status(201)
      .json({ message: "ok!", new_entry: createdAnnouncement });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Couldn't create new announcement",
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
    res.status(200).json(announcementData);
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
      .select("*")
      .where({ "weekly_announcement.is_draft": false });

    if (announcementData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any announcements.",
      });
    }
    res.status(200).json(announcementData);
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
    res.status(200).json(announcementData);
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
    const announcementChanges = req.body;

    await knex("weekly_announcement_bg")
      .where({ en_id: req.params.id })
      .update(announcementChanges);

    const updatedAnnouncement = await knex("weekly_announcement_bg")
      .select("*")
      .where({
        id: req.params.id,
      });

    return res.status(201).json(updatedAnnouncement[0]);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Unable to update the announcement",
      error: error,
    });
  }
};

//delete function deletes the announcement from both the english and the bulgarian tables
exports.deleteSingle = async (req, res) => {
  try {
    const verify = await knex("weekly_announcement_bg")
      .select("*")
      .where({ en_id: req.params.id });
    if (verify.length === 0) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "Couldn't find the announcement you're trying to delete",
        });
    }
    await knex("weekly_announcement_bg").where({ en_id: req.params.id }).del();
    await knex("weekly_announcement").where({ id: req.params.id }).del();
    return res
      .status(204)
      .json({ status: 204, message: "Announcement successfully deleted" });
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
