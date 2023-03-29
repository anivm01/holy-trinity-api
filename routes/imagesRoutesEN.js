const router = require("express").Router();
const imagesController = require("../controllers/imagesControllerEN");
const multer = require("multer");
// const multerS3 = require("multer-s3");
// import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
// const { S3Client } = require('@aws-sdk/client-s3')
// const S3 = require("@aws-sdk/client-s3").S3
// const PutObjectCommand = require("@aws-sdk/client-s3").PutObjectAclCommand
// require("dotenv").config();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// const s3 = new S3Client({
//     forcePathStyle: false, // Configures to use subdomain/virtual calling format.
//     endpoint: "https://nyc3.digitaloceanspaces.com",
//     region: "us-east-1",
//     credentials: {
//       accessKeyId: process.env.DO_SPACES_KEY,
//       secretAccessKey: process.env.DO_SPACES_SECRET
//     }
// })
// const s3Client = new S3({
//     forcePathStyle: false, // Configures to use subdomain/virtual calling format.
//     endpoint: "https://holy-trinity-image-storage.nyc3.cdn.digitaloceanspaces.com",
//     region: "us-east-1",
//     credentials: {
//       accessKeyId: process.env.SPACES_KEY,
//       secretAccessKey: process.env.SPACES_SECRET
//     }
// });

// Change bucket property to your Space name
// const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: "holy-trinity-image-storage",
//       acl: 'public-read',
//       key: function (req, file, cb) {
//         // console.log(file);
//         const date = Math.floor(Date.now()/1000)
//         cb(null, date+file.originalname);
//         req.url = date+file.originalname
//       }
//     })
//   });

// const upload = multer({ dest: 'images/' })
// const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT);

// const s3 = new S3({
//   region: spacesEndpoint,
//   accessKeyId: process.env.DO_SPACES_KEY,
//   secretAccessKey: process.env.DO_SPACES_SECRET,
// });
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.DO_SPACES_NAME,
//     acl: "public-read",
//     key: function (request, file, cb) {
//       console.log(file);
//       cb(null, file.originalname);
//     },
//   }),
// }).array("upload", 1);
router
  .route("/")
  .get(imagesController.readAll)
//   .post(upload, imagesController.create);

  .post(upload.single('image'), imagesController.create);

router
  .route("/:id")
  .get(imagesController.readSingle)
  // .put(imagesController.updateSingle)
  .delete(imagesController.deleteSingle);

module.exports = router;
