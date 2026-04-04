const User=require("../models/user.js");

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.sign=async(req,res,next)=>{
    try{
    const registereduser=await User.register( new User({
            username: req.body.username,
            email: req.body.email
        }),
        req.body.password);
    

    
    console.log(registereduser);
    req.login(registereduser,(err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
    })
     
    }
   catch(err){
  req.flash("error",err.message);
  res.redirect("/user/signup");   
}
}

module.exports.edit=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash("success","you are logged out successfully");
        res.redirect("/listings");
    })
} 

 
module.exports.log=async(req,res)=>{
    req.flash("success","welcome to wanderlust,YOU ARE LOGGED IN");
    const redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
}