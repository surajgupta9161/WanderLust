const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const userRoute = express.Router()

userRoute.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

userRoute.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        let registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.flash("success", `Welcome ${username} in WandeLust!`)
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }

})

userRoute.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

userRoute.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back!")
    res.redirect("/listings")
})

module.exports = userRoute;
