const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controller/review.js")
 
// review post route 
router.post("/", validateReview, isLoggedIn, wrapAsync (reviewController.newReviewPost));
// delete Review Route 
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync (reviewController.destroyOrDeleteReview));

module.exports = router
