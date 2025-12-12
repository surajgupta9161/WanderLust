module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to logged in!")
        return res.redirect("/login")
    }
    next()
}