const { required } = require("joi");
const mongoose = require("mongoose")
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email : {
        type: String,
        required: true
    },
   
})
userSchema.plugin(passportLocalMongoose, {usernameFied: "email"})

const User = mongoose.model("User", userSchema);
module.exports = User