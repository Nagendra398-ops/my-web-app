  
  const Listing=require("./models/listing.js");
  const Review=require("./models/review.js")
  module.exports.isLoggedin=(req,res,next)=>{
    
  if(!req.isAuthenticated()){
      if (req.session) {   
      req.session.redirectUrl = req.originalUrl;
    }
        req.flash("error","you must be logged");
        return res.redirect("/user/login");
    }
    next();
}


module.exports.savedDirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner=async(req,res,next)=>{
  
 
  let { id } = req.params;
  let listing = await Listing.findById(id);

  
  if (!listing.Owner.equals(res.locals.CurrUser._id)) {
    req.flash("error", "You are not authorized to change this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isauthor=async(req,res,next)=>{
  let{id,reviewId}=req.params;
   

 let review = await Review.findById(reviewId);
 

  if (!review.author.equals(res.locals.CurrUser._id)) {
    req.flash("error", "You are not authorized to change this review ");
    return res.redirect(`/listings/${id}`);
  }

  next();
}