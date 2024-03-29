const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT || 8080;

//user routes
const userRoutes = require("./routes/userRoutes.js")

const contactRoutes = require("./routes/contactRoutes.js")

//image only routes
const imagesRoutesEN = require("./routes/imagesRoutesEN.js")
const imagesRoutesBG = require("./routes/imagesRoutesBG.js")
const postedImageRoutes = require("./routes/postedImageRoutes.js")

//no image routes
const weeklyAnnouncementRoutesEN = require("./routes/weeklyAnnouncementRoutesEN.js");
const weeklyAnnouncementRoutesBG = require("./routes/weeklyAnnouncementRoutesBG.js");
const eventRoutes = require("./routes/eventRoutes.js")

//newly added
const calendarRoutes = require("./routes/calendarRoutes.js")
const resourcesRoutes = require("./routes/resourcesRoutes.js")
const priestResourcesRoutes = require("./routes/priestResourcesRoutes.js")

//worship office and related image routes
const worshipOfficeRoutesEN = require("./routes/worshipOfficeRoutesEN.js")
const worshipOfficeRoutesBG = require("./routes/worshipOfficeRoutesBG.js")
const thumbnailsRoutesEN = require("./routes/thumbnailsRoutesEN.js")
const thumbnailsRoutesBG = require("./routes/thumbnailsRoutesBG.js")

//obituaries and related image routes
const obituaryRoutesEN = require("./routes/obituaryRoutesEN.js")
const obituaryRoutesBG = require("./routes/obituaryRoutesBG.js")
const deceasedRoutesEN = require("./routes/deceasedRoutesEN.js")
const deceasedRoutesBG = require("./routes/deceasedRoutesBG.js")

//community news and related image routes
const articleRoutesEN = require("./routes/articleRoutesEN.js")
const articleRoutesBG = require("./routes/articleRoutesBG.js")
const featuredImagesRoutesEN = require("./routes/featuredImagesRoutesEN.js")
const featuredImagesRoutesBG = require("./routes/featuredImagesRoutesBG.js")

//read-only published routes
const publishedRoutesEN = require("./routes/publishedRoutesEN.js")
const publishedRoutesBG = require("./routes/publishedRoutesBG.js")

//read-only draft routes
const draftRoutesEN = require("./routes/draftRoutesEN.js")
const draftRoutesBG = require("./routes/draftRoutesBG.js")

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/users", userRoutes)
app.use("/contact", contactRoutes)

//updated

app.use("/event", eventRoutes)

//not updated

app.use("/weekly-announcement/en", weeklyAnnouncementRoutesEN)
app.use("/weekly-announcement/bg", weeklyAnnouncementRoutesBG)
app.use("/images/en", imagesRoutesEN)
app.use("/images/bg", imagesRoutesBG)
app.use("/worship-office/en", worshipOfficeRoutesEN)
app.use("/worship-office/bg", worshipOfficeRoutesBG)
app.use("/thumbnail/en", thumbnailsRoutesEN)
app.use("/thumbnail/bg", thumbnailsRoutesBG)
app.use("/obituary/en", obituaryRoutesEN)
app.use("/obituary/bg", obituaryRoutesBG)
app.use("/deceased/en", deceasedRoutesEN)
app.use("/deceased/bg", deceasedRoutesBG)



app.use("/article/en", articleRoutesEN)
app.use("/article/bg", articleRoutesBG)
app.use("/featured-image/en", featuredImagesRoutesEN)
app.use("/featured-image/bg", featuredImagesRoutesBG)


//newly added
app.use("/calendar", calendarRoutes)
app.use("/resources", resourcesRoutes)
app.use("/priest-resources", priestResourcesRoutes)

//published
app.use("/posted-images", postedImageRoutes)
app.use("/published/en", publishedRoutesEN)
app.use("/published/bg", publishedRoutesBG)

//drafts
app.use("/drafts/en", draftRoutesEN)
app.use("/drafts/bg", draftRoutesBG)

app.listen(PORT, () => {
    console.log(`Server listening`);
});