const knex = require("knex")(require("../knexfile"));
const sharp = require("sharp");
const crypto = require("crypto");
const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
require("dotenv").config();

const s3Client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

exports.create = async (req, res) => {
  try {
    if (!req.body.description || !req.body.descriptionBG) {
      return res.status(400).json({
        status: 400,
        message: "Make sure to provide a description",
      });
    }
    const file = req.file;
    const description = req.body.description;
    const descriptionBg = req.body.descriptionBG;

    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1080, width: 1920, fit: "inside", withoutEnlargement: true})
      .toBuffer();
      
      const fileName = generateFileName();
      const uploadParams = {
        Bucket: "holy-trinity-image-storage",
        Body: fileBuffer,
        Key: fileName,
        ContentType: file.mimetype,
      };
    await s3Client.send(new PutObjectCommand(uploadParams));

    const newImageEN = { description: description, url: fileName };
    const resultEN = await knex("images").insert(newImageEN);
    const createdImageEN = await knex("images")
      .select("*")
      .where({ id: resultEN[0] });

    const newImageBG = {
      description: descriptionBg,
      url: fileName,
      en_id: createdImageEN[0].id,
    };
    const resultBG = await knex("images_bg").insert(newImageBG);
    const createdImageBG = await knex("images_bg")
      .select("*")
      .where({ id: resultBG[0] });

    return res
      .status(201)
      .json({
        message: "ok!",
        new_image_en: createdImageEN,
        new_image_bg: createdImageBG,
      });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong with the database",
      error: error,
    });
  }
};

exports.readAll = async (_req, res) => {
  try {
    const imagesData = await knex.select("*").from("images");
    if (imagesData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Not Found: Couldn't find any images.",
      });
    }
  for (let image of imagesData) { // For each post, generate a signed URL and save it to the post object
    image.src = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: "holy-trinity-image-storage",
        Key: image.url
      }),
      { expiresIn: 60 }// 60 seconds
    )
  }

    res.status(200).json(imagesData);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.readSingle = async (req, res) => {
  try {
    const imageData = await knex
      .select("*")
      .from("images")
      .where({ id: req.params.id });
    if (imageData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Coundn't find the image you were looking for",
      });
    }
    let image = imageData[0]
    image.src = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: "holy-trinity-image-storage",
        Key: image.url
      }),
      { expiresIn: 60 }// 60 seconds
    )
    return res.json(image);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};

exports.deleteSingle = async (req, res) => {
  try {

    const imageData = await knex
      .select("*")
      .from("images")
      .where({ id: req.params.id });
    if (imageData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Coundn't find the image you were looking for",
      });
    }

    const deleteParams = {
      Bucket: "holy-trinity-image-storage",
      Key: imageData[0].url,
    }

    await s3Client.send(new DeleteObjectCommand(deleteParams))
    await knex("images").where({ id: req.params.id }).del();
    return res.status(204).json({ status: 204, message: "Delete successful" });
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
