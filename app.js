if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

//------------------------all requirments is here--------------------------------------------
const express=require("express");
const app=express();
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const  LocalStrategy = require("passport-local");
const methodOverride=require("method-override");
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");  // layout create kerne ke kaam aata h
const User=require("./models/user.js");
const ExpressError=require("./utils/ExpressError.js");
//----------------------------------------------------------------------------------------------




//-------------------------------------------------------------------------------------------

//---All routes here---------------------------------------------------------
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
//------------------------------------------------------------------------

const dbUrl=process.env.ATLASDB_URL;
//------setUP mongoDB here ------------------------------------------------------
main().then(()=>{
    console.log("connected to DB");
}).catch(err => {console.error(err);});

async function main(){
    await mongoose.connect(dbUrl);
}
//------------------------------------------------------------------------------


//-------------------------------------------------------( middelwares )-----------------------------------------------------------------------
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));//iska use hum form me url data ko encode kerne ke liye kerte hai 
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600, 
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err); 
})
//cookies
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge :  7*24*60*60*1000,
        httpOnly:true,
    }
};



app.use(session(sessionOptions));
app.use(flash());
//we need session to generate password
//we use A middleware that initializes passport
app.use(passport.initialize());
app.use(passport.session());// A web application needs the ability to identify users as they browse from page to page.this series of reqs and responses , each associated with the same user,is known as session.
passport.use(new LocalStrategy(User.authenticate()));//jitne bhi user aaye vo local strategy ke through authenticate hone chaiye aur autenticate user ko login and sing up karane me bhi use hota hai yh static method hai 
//autenticate generates a fun that is used in passports LocalStratergy
passport.serializeUser(User.serializeUser());//static method to serialize user into session
passport.deserializeUser(User.deserializeUser());//remove kerna  jb session ktm ho jaye tb use hota hai

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
// console.log(res.locals.success);
next();
});
app.use("/",listingsRouter);
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
// if page not found
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page Not Found!"));
})
app.all("/",(req,res,next)=>{
    res.redirect("/listings");
});

//midddleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
//    res.status(statusCode).send(message);
});
//----------------------------------------------------------------------------------------------------------------------------------------



//-----------------------------------------------all request routes is here ----------------------------------------------------------



app.listen(8080,()=>{
    console.log("server is litening to port 8080");
});

//-------------------------------------------------------------------------------------------------------------------------

