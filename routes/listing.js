const express = require("express")
const listingRoute = express.Router()
const { listingSchema } = require("../joischema.js");
const wrapAsync = require("../utils/wrapAsync.js")
const listing = require("../models/listings.js");
const passport = require("passport");
const { isLoggedIn, isOwner } = require("../middleware.js")

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
listingRoute.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

//show route
listingRoute.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!list) {
        req.flash("error", "Listing does not exist!")
        res.redirect("/listings")
    } else {
        res.render("listings/show.ejs", { list });
    }
}));

//Create route
listingRoute.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing added!")
    res.redirect("/listings");
}));

//Edit route
listingRoute.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    if (!editListing) {
        req.flash("error", "Listing does not exist!")
        res.redirect("/listings")
    } else {
        res.render("listings/edit.ejs", { editListing });
    }

}))

listingRoute.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
}))

//delete route

listingRoute.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}));

module.exports = listingRoute;