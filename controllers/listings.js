const Listing = require("../models/listings")


module.exports.indexRoute = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!list) {
        req.flash("error", "Listing does not exist!")
        res.redirect("/listings")
    } else {
        res.render("listings/show.ejs", { list });
    }
}

module.exports.saveListing = async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing added!")
    res.redirect("/listings");
}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    let editListing = await Listing.findById(id);
    if (!editListing) {
        req.flash("error", "Listing does not exist!")
        res.redirect("/listings")
    } else {
        res.render("listings/edit.ejs", { editListing });
    }
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}