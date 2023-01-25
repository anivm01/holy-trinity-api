const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use(cors());

//routes

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});