const mongoose = require("mongoose")
const {Schema} = mongoose;
const Review = require("./review.js")
const User = require("./user.js")

const listingSchema  = new Schema({
 title: String,
    description: String,
    image: {
        url: String,
        filename: String
    },
     price: Number,
     location: String,
     country: String, 
     reviews:[{
      type: Schema.Types.ObjectId,
      ref: "Review"
     }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    } 
     }
  );
  // listingSchema.post("findOneAndDelete", async (listing) =>{
  //   await Review.deleteMany({_id: {$in: listing.reviews}})
  // });

  const Listing = mongoose.model('Listing', listingSchema);
  module.exports = Listing