const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userRoute = express.Router()
const userController = require("../controllers/users")

userRoute.route("/signup").get(userController.signupForm).post(userController.signup)

userRoute.route("/login").get(userController.loginForm).post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)

userRoute.get("/logout", userController.logout)

module.exports = userRoute;
