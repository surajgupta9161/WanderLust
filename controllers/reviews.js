const Listing = require("../models/listings")
const Review = require("../models/review")


module.exports.saveReview = async (req, res) => {
    let revlisting = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    revlisting.reviews.push(newReview)
    await newReview.save();
    await revlisting.save();
    req.flash("success", "Review added!")
    res.redirect(`/listings/${revlisting.id}`)
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!")
    res.redirect(`/listings/${id}`);

}