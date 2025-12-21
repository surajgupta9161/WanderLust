const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userRoute = express.Router()
const userController = require("../controllers/users")

userRoute.get("/signup", userController.signupForm)

userRoute.post("/signup", userController.signup)

userRoute.get("/login", userController.loginForm)

userRoute.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)

userRoute.get("/logout", userController.logout)

module.exports = userRoute;
