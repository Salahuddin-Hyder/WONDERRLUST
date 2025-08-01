const Listing = require("../models/listings.js")
const listingRoute = require("../routes/listings.js");

module.exports.index = async(req, res)=>{
    const allListing = await Listing.find({}) 
    res.render("listings/index.ejs", {allListing})
};
module.exports.renderNewListingForm =  (req, res)=>{
  res.render("listings/new.ejs")

};
module.exports.newListingPost =  async (req, res)=>{
  let url = req.file.path;
  let filename = req.file.filename 
  const  newlisting = new Listing(req.body.listing)
  newlisting.owner = req.user.id   // for showing username which shows who logged In will the owner of new Listing 
  newlisting.image = {url, filename}
  await newlisting.save()
  req.flash("success", "successfully listing created!")
  res.redirect("/listings")
};
module.exports.UpdateListing = async (req,res)=>{
  let {id} = req.params
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing})
  if(typeof req.file !== "undefined"){
  let url = req.file.path
  let filename = req.file.filename
  listing.image = {url, filename}
  await listing.save()
  }
  req.flash("success", "Listing updated successfully")
  res.redirect(`/listings/${id}`)
};
module.exports.showListing = async (req, res)=>{
  let {id} = req.params
  const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner")
  if(!listing){
    req.flash("error"," Listing you are trying to access is not available")
   return res.redirect("/listings")
   
    }
  res.render("listings/show.ejs", {listing})
};
module.exports.editformRendering = async(req, res)=>{
  let {id} = req.params
  const listing = await Listing.findById(id)
   if(!listing){
    req.flash("error"," Listing you are trying to access is not available")
   return res.redirect("/listings")
  }
  let originalImage = listing.image.url
   originalImage = originalImage.replace("/upload", "/upload/ar_1.0,c_thumb,g_face,w_0.6,z_0.7/r_max/co_black,e_outline/co_dimgrey,x_30,y_40")
  res.render("listings/edit.ejs", {listing, originalImage})
};
module.exports.deleteOrDestroyListing = async (req, res)=>{
  let {id} = req.params
await Listing.findByIdAndDelete(id, {...req.body.listing})
req.flash("success", "Listing deleted successfully")
res.redirect("/listings")
}