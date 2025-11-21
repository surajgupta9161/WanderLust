const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

app.listen(8080, () => {
    console.log("Listing By Port 8080");
})
let MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => console.log("Connect to the DB")).catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGOOSE_URL)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")))


app.get("/", (req, res) => {
    res.send("Home Route /");
})

//index route
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    res.render("listings/show.ejs", { list });
}));

//Create route
app.post("/listings", wrapAsync(async (req, res, next) => {
    if (!req.body.list) {
        throw new ExpressError(400, "Send Valid Data");
    }
    let newListing = new listing(req.body.list);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route

app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
}))

app.put("/listing/:id", wrapAsync(async (req, res) => {
    if (!req.body.list) {
        throw new ExpressError(400, "Send Valid Data");
    }
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/listings/${id}`);
}))

//delete route

app.delete("/listing/:id/delete", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// app.all("/*", (req, res, next) => {
//     let { status = 500, message = "Page Not Found!!" } = err;
//     res.status(status).send(message);
// })

app.use((req, res) => {
    res.status(404).render("listings/error.ejs", message = "Page Not Found");
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Sothing went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message });
})

