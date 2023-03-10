const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const weeklyAnnouncementRoutesEN = require("./routes/weeklyAnnouncementRoutesEN.js");
const weeklyAnnouncementRoutesBG = require("./routes/weeklyAnnouncementRoutesBG.js");
const imagesRoutesEN = require("./routes/imagesRoutesEN.js")
const imagesRoutesBG = require("./routes/imagesRoutesBG.js")
const worshipOfficeRoutesEN = require("./routes/worshipOfficeRoutesEN.js")
const worshipOfficeRoutesBG = require("./routes/worshipOfficeRoutesBG.js")
const obituaryRoutesEN = require("./routes/obituaryRoutesEN.js")
const obituaryRoutesBG = require("./routes/obituaryRoutesBG.js")
const eventRoutesEN = require("./routes/eventRoutesEN.js")
const eventRoutesBG = require("./routes/eventRoutesBG.js")
const articleRoutesEN = require("./routes/articleRoutesEN.js")
const articleRoutesBG = require("./routes/articleRoutesBG.js")
const postedImageRoutes = require("./routes/postedImageRoutes.js")
const publishedRoutesEN = require("./routes/publishedRoutesEN.js")
const publishedRoutesBG = require("./routes/publishedRoutesBG.js")

//middleware
app.use(express.json());
app.use(cors());
app.use("/images", express.static("./images"))

//routes
app.use("/weekly-announcement/en", weeklyAnnouncementRoutesEN)
app.use("/weekly-announcement/bg", weeklyAnnouncementRoutesBG)
app.use("/images/en", imagesRoutesEN)
app.use("/images/bg", imagesRoutesBG)
app.use("/worship-office/en", worshipOfficeRoutesEN)
app.use("/worship-office/bg", worshipOfficeRoutesBG)
app.use("/obituary/en", obituaryRoutesEN)
app.use("/obituary/bg", obituaryRoutesBG)
app.use("/event/en", eventRoutesEN)
app.use("/event/bg", eventRoutesBG)
app.use("/article/en", articleRoutesEN)
app.use("/article/bg", articleRoutesBG)

//published
app.use("/posted-images", postedImageRoutes)
app.use("/published/en", publishedRoutesEN)
app.use("/published/bg", publishedRoutesBG)


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});