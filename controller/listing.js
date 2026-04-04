const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.render=(req,res)=>{
    
    res.render("listings/new.ejs");
 
}

module.exports.new=async(req,res,next)=>{
  let url=req.file.path;
  let filename=req.file.filename;
  
    const newlisting=new Listing(req.body.listing);  
     newlisting.Owner = req.user._id; 
    if (req.file) {
    newlisting.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
    console.log(url);
    console.log(filename);
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
  
 
}

module.exports.show=async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("Owner"); 
    if(!listing){
         req.flash("error","listing not found");
         res.redirect("/listings");
    }
    else{
            res.render("listings/show.ejs",{listing});
    }
}

module.exports.get=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);

     if(!listing){
         req.flash("error","listing not found");
         res.redirect("/listings");
    }
    else{
        let originalImage=listing.image.url;
        originalImage=originalImage.replace("/upload","/upload/h_50,w_100");
        console.log("Resized Image URL:", originalImage);
console.log("Resized Image URL:", originalImage);

    res.render("listings/edit.ejs",{listing,originalImage});
    }
}

module.exports.edit=async(req,res)=>{
    
     let {id}=req.params;
     
   let listing=  await Listing.findByIdAndUpdate(id,req.body.listing);
   if(typeof(req.file)!="undefined"){
      let url=req.file.path;
  let filename=req.file.filename;
    listing.image={ url,filename};
    
   }
   console.log(req.body);
   await listing.save();
     req.flash("success","Listing Updated");
     res.redirect(`/listings/${id}`);
}
module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}


module.exports.search=async(req,res)=>{
    let {country}=req.query;
    if (!country) {
    return res.redirect("/listings");
}
    let Listings=await Listing.find({
    country: { $regex: country, $options: "i" } 
});
    console.log(Listings);
    res.render("listings/search.ejs",{Listings});
}