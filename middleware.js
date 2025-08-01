const Listing = require("./models/listings")
const Review = require("./models/review.js");
const ExpressError = require("./utils/expressError.js")
const {listingSchema} = require("./joi.js");
const {reviewSchema} = require ("./joi.js")

module.exports.isLoggedIn = (req, res, next)=>{ 
  if(!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl
    req.flash("error", "You must be loggedin")
    return res.redirect("/login")
  }
  next()
}

module.exports.savedUrl = (req, res, next)=>{
if(req.session.redirectUrl){
  res.locals.redirectUrl = req.session.redirectUrl
}
next();
};
module.exports.isOwner = async(req, res, next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id)
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You are not a owner of the listing")
    return res.redirect(`/listings/${id}`)
  }
  
next();
};
module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=> el.message).join("")
        throw new ExpressError(404, errMsg)
    }else {
        next()
    }
};
module.exports.validateReview  = (req, res, next)=>{
     let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=> el.message).join("")
        throw new ExpressError(404, errMsg)
    }else {
        next()
    }
};

module.exports.isReviewAuthor = async (req, res, next)=>{
  let {id, reviewid} = req.params;
  let review = await Review.findById(reviewid) 
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "you are not the owner of this listing")
    return res.redirect(`/listings/${id}`)
  }
  next()
}