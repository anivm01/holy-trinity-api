const knex = require("knex")(require("../knexfile"));
const sharp = require("sharp");
const crypto = require("crypto");
const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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

const generateFileName = (extension, bytes = 32) =>
    `${crypto.randomBytes(bytes).toString("hex")}.${extension}`;

exports.create = async (req, res) => {
    try {
        const file = req.file; // Assuming the file is being passed in the request's `file` object
        const caption = req.body.caption;

        let fileBuffer = file.buffer;
        let contentType = file.mimetype;

        // Check if the file is an image (by mimetype)
        if (file.mimetype.startsWith('image/')) {
            // Process the image if it's an image
            fileBuffer = await sharp(file.buffer)
                .resize({
                    height: 1080,
                    width: 1920,
                    fit: "inside",
                    withoutEnlargement: true,
                })
                .toBuffer();
        } // No else block needed; if it's not an image, we simply don't process it

        // Extract the file extension for filename generation
        const fileExtension = file.originalname.split('.').pop();
        const fileName = generateFileName(fileExtension);

        const uploadParams = {
            Bucket: "holy-trinity-image-storage", // Your bucket name
            Body: fileBuffer,
            Key: fileName,
            ACL: 'public-read', // Make the file publicly accessible
            ContentType: contentType,
        };

        // Upload the file to DigitalOcean Spaces
        await s3Client.send(new PutObjectCommand(uploadParams));

        // Construct the URL based on the bucket and the file name
        const url = `https://${uploadParams.Bucket}.nyc3.digitaloceanspaces.com/${fileName}`;

        // Insert record into the uploads table
        const newUpload = {
            fileName: fileName,
            url: url,
            fileType: contentType,
            caption: caption,
        };
        const result = await knex("uploads").insert(newUpload);
        const createdUpload = await knex("uploads")
            .select("*")
            .where({ id: result[0] });

        console.log("File uploaded successfully");
        return res.status(201).json({
            message: "ok!",
            upload: createdUpload,
        });
    } catch (error) {
        console.log("File failed to upload");
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "File upload failed.",
            error: error,
        });
    }
};

exports.deleteSingle = async (req, res) => {
    try {
        const imageData = await knex
            .select("*")
            .from("uploads")
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
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
        await knex("uploads").where({ id: req.params.id }).del();
        return res.status(204).json({ status: 204, message: "Delete successful" });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "There was an issue with the database",
            error: error,
        });
    }
};

exports.readAllPDFs = async (req, res) => {
    try {
        // Fetch all records where fileType is 'application/pdf'
        const pdfFiles = await knex('uploads')
            .where('fileType', 'application/pdf')
            .select('*');

        res.json({
            message: 'PDF files retrieved successfully',
            data: pdfFiles
        });
    } catch (error) {
        console.error('Error fetching PDF files:', error);
        res.status(500).json({
            message: 'Error fetching PDF files',
            error: error
        });
    }
};

exports.readAllImages = async (req, res) => {
    try {
        // Fetch all records where fileType starts with 'image/'
        const imageFiles = await knex('uploads')
            .where('fileType', 'like', 'image/%')
            .select('*');

        res.json({
            message: 'Image files retrieved successfully',
            data: imageFiles
        });
    } catch (error) {
        console.error('Error fetching image files:', error);
        res.status(500).json({
            message: 'Error fetching image files',
            error: error
        });
    }
};