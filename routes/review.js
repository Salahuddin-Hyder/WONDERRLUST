const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

 
// review post route 
router.post("/", validateReview, isLoggedIn, wrapAsync (async(req, res)=>{
 let listing = await Listing.findById(req.params.id)
 let newReview = new Review(req.body.review)
  newReview.author = req.user._id
 listing.reviews.push(newReview)
 await newReview.save()
 await listing.save()

 res.redirect(`/listings/${listing._id}`)
}));
// delete Review Route 
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync (async (req, res)=>{
    let {id, reviewid} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})
  await Review.findByIdAndDelete(reviewid)
  req.flash("success", "review deleted Successfully")
  res.redirect(`/listings/${id}`)
}));

module.exports = router
