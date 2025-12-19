const listing = require("./models/listings")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to logged in!")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let Onelisting = await listing.findById(id);
    if (!Onelisting.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of the listing!");
        return res.redirect(`/listings/${id}`);
    }
    next()
}