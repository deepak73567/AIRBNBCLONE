const mongoose=require('mongoose');
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch(err => {console.error(err);});
 
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB =async ()=>{
    await Listing.deleteMany({});//map new array banata h aur ushi me insert keta h
    initData.data=initData.data.map((obj)=>({...obj,owner:"65e8a8b7fbc5544749fafeef"}));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}
initDB();