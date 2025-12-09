const express = require("express")
const listingRoute = express.Router()
const { listingSchema } = require("../joischema.js");
const wrapAsync = require("../utils/wrapAsync.js")
const listing = require("../models/listings.js");




const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message);
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

//index route
listingRoute.get("/", wrapAsync(async (req, res) => {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

//New Route
listingRoute.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
listingRoute.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { list });
}));

//Create route
listingRoute.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route
listingRoute.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
}))

listingRoute.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))

//delete route

listingRoute.delete("/:id/delete", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = listingRoute;