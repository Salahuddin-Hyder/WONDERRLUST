const express = require("express")
const router = express.Router();
const Listing = require("../models/listings.js")
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn, isOwner, validateListing, } = require("../middleware.js");

 
router.get("/new", isLoggedIn, (req, res)=>{
   
  res.render("listings/new.ejs")
})
// new listings. 
router.post("/", validateListing,  wrapAsync (  async (req, res)=>{
  let newlisting = new Listing(req.body.listing)
  newlisting.owner = req.user.id   // for showing username which shows who logged In will the owner of new Listing 
  await newlisting.save()
  req.flash("success", "successfully listing created!")
  res.redirect("/listings")
}))
// index route 
router.get("/", wrapAsync ( async(req, res)=>{
    const allListing = await Listing.find({}) 
    res.render("listings/index.ejs", {allListing})
}));
 //update route 
router.put("/:id", isOwner, validateListing, wrapAsync ( async (req,res)=>{
  let {id} = req.params
  await Listing.findByIdAndUpdate(id, {...req.body.listing})
  req.flash("success", "Listing updated successfully")
  res.redirect(`/listings/${id}`)
}));
 
/// show route
router.get("/:id", wrapAsync ( async (req, res)=>{
  let {id} = req.params
  const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner")
  if(!listing){
    req.flash("error"," Listing you are trying to access is not available")
   return res.redirect("/listings")
   
    }
  res.render("listings/show.ejs", {listing})
}));
 
// EDIT  route FORM RENDERING 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (async(req, res)=>{
  let {id} = req.params
  const listing = await Listing.findById(id)
   if(!listing){
    req.flash("error"," Listing you are trying to access is not available")
   return res.redirect("/listings")
  }
  res.render("listings/edit.ejs", {listing})
}));
 // delete route 
router.delete("/:id", isOwner, wrapAsync (async (req, res)=>{
  let {id} = req.params
await Listing.findByIdAndDelete(id, {...req.body.listing})
req.flash("success", "Listing deleted successfully")
res.redirect("/listings")
}));

module.exports = router    