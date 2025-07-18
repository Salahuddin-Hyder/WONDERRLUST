const Review = require("../models/review.js")
const Listing = require("../models/listings.js")
const listingReview = require("../routes/listings.js");

// new Review 
module.exports.newReviewPost = async(req, res)=>{
 let listing = await Listing.findById(req.params.id)
 let newReview = new Review(req.body.review)
  newReview.author = req.user._id
 listing.reviews.push(newReview)
 await newReview.save()
 await listing.save()

 res.redirect(`/listings/${listing._id}`)
};

//Destroy review

module.exports.destroyOrDeleteReview = async (req, res)=>{
    let {id, reviewid} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})
  await Review.findByIdAndDelete(reviewid)
  req.flash("success", "review deleted Successfully")
  res.redirect(`/listings/${id}`)
}

