const mongoose = require("mongoose");
const initData  = require("./data.js")
const Listing = require("../models/listings.js")
 

main().then((res)=>{
    console.log("connected to Database")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
}
 
const initD = async () =>{
  await Listing.deleteMany({})
  initData.data = initData.data.map((obj)=>({...obj, owner: "6868ddcfe8c3512b452f47a2",}))
  await Listing.insertMany(initData.data)
  console.log("Data Initialized.");

}

initD();