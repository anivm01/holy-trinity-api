const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const weeklyAnnouncementRoutesEN = require("./routes/weeklyAnnouncementRoutesEN.js");
const weeklyAnnouncementRoutesBG = require("./routes/weeklyAnnouncementRoutesBG.js");
const imagesRoutesEN = require("./routes/imagesRoutesEN.js")
const imagesRoutesBG = require("./routes/imagesRoutesBG.js")

//middleware
app.use(express.json());
app.use(cors());
app.use("/images", express.static("./images"))

//routes
app.use("/weekly-announcement/en", weeklyAnnouncementRoutesEN)
app.use("/weekly-announcement/bg", weeklyAnnouncementRoutesBG)
app.use("/images/en", imagesRoutesEN)
app.use("/images/bg", imagesRoutesBG)


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});