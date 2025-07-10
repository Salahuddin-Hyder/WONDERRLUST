const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema} = require ("./joi.js");
const {reviewSchema} = require ("./joi.js");
const session = require("express-session");
const flash = require("connect-flash");
const {isLoggedIn} = require("./middleware.js")
  
const passport = require ("passport");
const LocalStrategy = require ("passport-local")
const User = require("./models/user.js")

const listingRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/review.js"); 
const userRoute = require("./routes/user.js");
 
main().then((res)=>{
    console.log("connected to Database")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
};
app.get("/", (req, res)=>{
  res.send("welcome to AIRBNB")
})
 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions= {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
     expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
     maxAge: 7 * 24 * 60 * 60 * 1000, 
     httpOnly: true
  }
}
app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use User model's authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user
  next()
})
app.get("/demo", async(req, res)=>{
  let fakeUser = new User({
    email: "fake@gmail.com",
    username: "Salahuddin-hyder1"
  })
  let registeredUser = await User.register(fakeUser, "hyder")
  res.send(registeredUser)
})
 
 
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.use((req, res, next) => {
    next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode=505, message="page not found"} = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message)
})
   
app.listen("8080", (req, res)=>{
console.log("app is  listening on port 8080")
})