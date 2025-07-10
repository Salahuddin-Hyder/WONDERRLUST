const mongoose = require("mongoose")
const {Schema} = mongoose;

const reviewSchema = new mongoose.Schema ({
    rating: {
      type: Number, 
      min: 1,
      max: 5
    },
    comment: {
      type: String,
     
    }, 
  createdat: {
    type: Date,
    default: Date.now()
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User" 
  }
});
const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
 