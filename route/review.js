const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const {isLoggedin,isauthor}=require("../middleware.js")
const reviewcontroller=require("../controller/review.js");
const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next(); 
    }
}
  


router.post("/",isLoggedin,validateReview,wrapAsync(reviewcontroller.get));

// Add wrapAsync to catch errors
router.delete("/:reviewId", isLoggedin, isauthor, wrapAsync(reviewcontroller.delete));


module.exports=router;