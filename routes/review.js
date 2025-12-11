const express = require("express");
const reviewRoute = express.Router({ mergeParams: true })
const listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../joischema.js");
const Review = require("../models/review.js")

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message);
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

//review route
reviewRoute.post("/", validateReview, wrapAsync(async (req, res) => {
    let revlisting = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    revlisting.reviews.push(newReview)
    await newReview.save();
    await revlisting.save();
    req.flash("success", "Review added!")
    res.redirect(`/listings/${revlisting.id}`)
}))

//Delete Review Route
reviewRoute.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!")
    res.redirect(`/listings/${id}`);

}))

module.exports = reviewRoute;
