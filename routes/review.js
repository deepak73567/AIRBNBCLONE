const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsyc.js");
const {validateReview, isloggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/review.js");


//post review route
router.post("/",isloggedIn,validateReview,wrapAsync(reviewController.createReview));
  
  //delete review Route
   router.delete("/:reviewId",isloggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

   module.exports=router;
  