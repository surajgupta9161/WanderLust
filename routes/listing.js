const express = require("express")
const listingRoute = express.Router()
const { listingSchema } = require("../joischema.js");
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const { isLoggedIn, isOwner } = require("../middleware.js")
const listingController = require("../controllers/listings.js")

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
listingRoute.get("/", wrapAsync(listingController.indexRoute));

//New Route
listingRoute.get("/new", isLoggedIn, listingController.newForm)

//show route
listingRoute.get("/:id", wrapAsync(listingController.showListing));

//Create route
listingRoute.post("/", isLoggedIn, validateListing, wrapAsync(listingController.saveListing));

//Edit route
listingRoute.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm))

//Update Route
listingRoute.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))

//delete route
listingRoute.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.destroy));

module.exports = listingRoute;