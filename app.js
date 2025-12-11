const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const session = require("express-session")
const flash = require("connect-flash")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")))

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expries: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use(session(sessionOptions))
app.use(flash())
//create flash 
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.use("/listings", listingRoute)
app.use("/listings/:id/review", reviewRoute)

app.get("/", (req, res) => {
    res.send("Home Route /");
})

app.use((req, res) => {
    res.status(404).render("listings/error.ejs", message = "Page Not Found");
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Somthing went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message });
})

app.listen(8080, () => {
    console.log("Listing By Port 8080");
})
let MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => console.log("Connect to the DB")).catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGOOSE_URL)
}