const express = require("express");
const multer = require("multer");
const uploadsController = require("../controllers/uploadsController");
const authorizeAdmin = require("../middleware/authorizeAdmin");

const router = express.Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route for file uploads
router
    .route("/upload")
    .post(authorizeAdmin, upload.single('file'), uploadsController.create)
    .delete(authorizeAdmin, uploadsController.deleteSingle)

router
    .route("/pdfs")
    .get(uploadsController.readAllPDFs);

router
    .route("/images")
    .get(uploadsController.readAllImages);


module.exports = router;