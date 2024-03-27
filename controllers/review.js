const Listing=require("../models/listing");
const Review=require("../models/review");


module.exports.createReview=async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;  // review ka author
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New  Review Created!");
    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    //array me bhi delte kerna hoga so  we use pull operator reviews array ke ander reviewid ko remove karega 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
     };