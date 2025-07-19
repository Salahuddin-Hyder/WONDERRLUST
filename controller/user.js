const { model } = require("mongoose");
const User = require("../models/user.js");
const userRoute = require("../routes/user.js");

module.exports.signUpGet = (req,res)=>{
    res.render("listings/signup.ejs")
   
};

module.exports.signUpPost = async (req,res)=>{
    let {username, email, password} = req.body;
    const newUser = new User ({username, email})
    try {
         const registeredUser = await User.register(newUser, password)
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err)
        }
         req.flash("success", "welcome to Wonderlust")
    res.redirect("/listings")
    })
        } catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }
    
};
module.exports.loginGet = (req, res)=>{
    res.render("listings/login.ejs")
};
module.exports.loginPost = (req, res)=>{
   req.flash("success", `Successfully Logged In, Welcome to Wonderlust ${req.user.username}`) // to display user name in flash message 
    let redirectUrl = res.locals.redirectUrl || "/listings" // for redirect into the addlisting page from where the user logged In 
    res.redirect(redirectUrl)                               // midddleware used savedUrl
};
module.exports.logoutGet = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","you are logged Out")
        res.redirect("/listings")
    })
}