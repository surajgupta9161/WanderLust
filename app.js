const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");

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


app.get("/", (req, res) => {
    res.send("Home Route /");
})

//index route
app.get("/listings", async (req, res) => {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings })
})

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    res.render("listings/show.ejs", { list });
})

//Create route
app.post("/listings", async (req, res) => {
    let newListing = new listing(req.body.list);
    await newListing.save();
    res.redirect("/listings");
})

//Edit route

app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
})

app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/listings/${id}`);
})

//delete route

app.delete("/listing/:id/delete", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


