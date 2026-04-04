const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");

const {isLoggedin,isOwner}=require("../middleware.js");

const multer = require("multer"); 
 
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
const listingcontroller=require("../controller/listing.js");
 
const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

router.get("/country",wrapAsync(listingcontroller.search));
router.
route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedin,upload.single('listing[image]'),wrapAsync(listingcontroller.new))
 
 

router.get("/new",isLoggedin,listingcontroller.render);
router.route("/:id")
.get(wrapAsync(listingcontroller.show))
.put(isLoggedin,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.edit))
.delete(isLoggedin,isOwner,wrapAsync(listingcontroller.delete))





router.get("/:id/edit",isOwner,wrapAsync(listingcontroller.get));




module.exports=router;