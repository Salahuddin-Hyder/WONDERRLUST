const express = require("express")
const router = express.Router(); 
const User = require("../models/user.js");
const { ref } = require("joi");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const userController = require("../controller/user.js")

router.get("/signup",  userController.signUpGet)
router.post("/signup",  userController.signUpPost);
router.get("/login",  userController.loginGet);
router.post("/login", savedUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true,}),  userController.loginPost);
router.get("/logout",  userController.logoutGet)

module.exports = router

