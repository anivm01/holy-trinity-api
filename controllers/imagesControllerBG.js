const knex = require("knex")(require("../knexfile"));
const { GetObjectCommand } = require("@aws-sdk/client-s3") 
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

exports.readSingle = async (req, res) => {
  try {
    const imageData = await knex
      .select("*")
      .from("images_bg")
      .where({ en_id: req.params.id });
    if (imageData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Coundn't find the image you were looking for",
      });
    }
    let image = imageData[0];
    image.src = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: "holy-trinity-image-storage",
        Key: image.url,
      }),
      { expiresIn: 60 } // 60 seconds
    );
    return res.json(image);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "There was an issue with the database",
      error: error,
    });
  }
};