if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}  
 
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cookieparser=require("cookie-parser");
const path=require("path");
const ejsmate=require("ejs-mate");
const methodOverride=require("method-override");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localstrategy=require("passport-local");
const User=require("./models/user.js");

let sessionoptions={
    secret:"my secret code",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*1000,
        httpOnly:true,
        maxAge:7*24*60*1000
    }    
}

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


 
app.use(cookieparser());
const ExpressError=require("./utils/ExpressError.js");

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.CurrUser=req.user;
    next();
})

 
const listing=require("./route/listing.js");
const review=require("./route/review.js");
const user=require("./route/user.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine","ejs");
app.set( "views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsmate);
app.use(methodOverride("_method"));
const url="mongodb://127.0.0.1:27017/website";
async function main() {
    await mongoose.connect(url);
}

 
 main().then(()=>{
    console.log("connected to db");
 })
 .catch((err)=>{
    console.log(err);
 })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//    res.send("Hi, I am root");
// }) 

 

 app.use("/listings/:id/reviews",review);
app.use("/listings",listing);

 
app.use("/user",user);
 
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
   let { statuscode = 500, message = "Something went wrong" } = err;
res.status(statuscode).render("listings/error.ejs",{err});
//    res.status(statuscode).send (message);
})
app.listen(8080,()=>{
    console.log("server started");
})