const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const weeklyAnnouncementRoutes = require("./routes/weeklyAnnouncementRoutes.js");
const weeklyAnnouncementRoutesBG = require("./routes/weeklyAnnouncementRoutesBG.js");

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/weekly-announcement/en", weeklyAnnouncementRoutes)
app.use("/weekly-announcement/bg", weeklyAnnouncementRoutesBG)

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});