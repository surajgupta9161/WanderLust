const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userRoute = express.Router()

userRoute.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

userRoute.post("/signup", async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        let registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", `Welcome ${username} in WandeLust!`)
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }

})

userRoute.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

userRoute.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
})

userRoute.get("/logout", (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error)
        }
        req.flash("success", "user logout!")
        res.redirect("/listings")
    })
})

module.exports = userRoute;
