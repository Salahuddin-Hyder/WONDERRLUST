const express = require("express")
const router = express.Router();
const Listing = require("../models/listings.js")
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn, isOwner, validateListing, } = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
const listingController = require("../controller/listing.js")
 
router
.route("/")
 .get(wrapAsync (listingController.index))
 .post(
    upload.single('listing[image]'), isLoggedIn,validateListing,  wrapAsync (listingController.newListingPost)
);
 
router.get("/new", isLoggedIn, listingController.renderNewListingForm)   // render form through controller

router
.route("/:id")
.get(wrapAsync ( listingController.showListing))
.put(isOwner,upload.single('listing[image]'), validateListing, wrapAsync (listingController.UpdateListing))
.delete(isOwner, wrapAsync (listingController.deleteOrDestroyListing));

//  //update route 
// router.put("/:id", isOwner, validateListing, wrapAsync (listingController.UpdateListing));
//  /// show route
// router.get("/:id", wrapAsync ( listingController.showListing));
//  // EDIT  route FORM RENDERING 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.editformRendering));
 // delete route 
// router.delete("/:id", isOwner, wrapAsync ( listingController.deleteOrDestroyListing));

module.exports = router    