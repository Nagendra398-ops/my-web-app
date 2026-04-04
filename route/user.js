const express=require("express");
 
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {savedDirectUrl}=require("../middleware.js");
const usercontroller=require("../controller/user.js");
 
router.route("/signup")
.get(usercontroller.signup)
.post(wrapAsync(usercontroller.sign))


router.route("/login")
.get(usercontroller.edit)
.post(savedDirectUrl,passport.authenticate("local",{failureRedirect:'/user/login',failureFlash:true}),usercontroller.log)

router.get("/logout",usercontroller.login);
module.exports=router;