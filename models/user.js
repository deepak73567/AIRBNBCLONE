const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

//passport-local-mongoose will add a username , hash and salt field to store the username the hashed password and salt value

const userSchema = new Schema({
   email:{
    type: String, 
    required: true
   }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);

//passport local  mongoose automatically add intance method like 
// setPassword,change pass,authenticate pass,resetAttempts,callback arguments,error handling

// also generate Static method
// authenticate(),serializeUser,de-,register(),findusername,createStratergy()