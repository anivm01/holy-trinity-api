const knex = require("knex")(require("../knexfile"));

async function transferImagesToUploads() {
    try {
        // Select all records from the 'images' table
        const images = await knex('images').select('*');

        // Transform each 'image' record to fit the 'uploads' schema
        const uploads = images.map(image => ({
            fileName: `${image.url}.jpg`, // Append '.jpg' to the file name stored in the 'url' field
            url: `https://your-bucket-name.nyc3.digitaloceanspaces.com/${image.url}.jpg`, // Construct the full URL
            fileType: 'image/jpeg',
            caption: image.description,
            created_at: new Date(),
            updated_at: new Date(),
        }));

        // Insert transformed records into the 'uploads' table
        await knex('uploads').insert(uploads);

        console.log('Successfully transferred images to uploads table.');
    } catch (error) {
        console.error('Failed to transfer images to uploads table:', error);
    }
}

// Run the script
transferImagesToUploads();