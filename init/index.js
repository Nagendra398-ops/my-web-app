const mongoose=require("mongoose");
const initdata=require("./data");
const Listing=require("../models/listing.js");


  
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

 const initDB=async()=>{
    await Listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj,Owner:'69c7c99dcd31fd377321162c'}));
    await Listing.insertMany(initdata.data);
    console.log("data was intialized");
 } 
 initDB();
 