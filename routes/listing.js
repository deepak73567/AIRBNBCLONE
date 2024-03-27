

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer=require("multer"); //form ke data ko parse karega(multer)
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//index and create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,

    wrapAsync(listingController.createListing)
  );
 

//new route
router.get("/new", isloggedIn, listingController.renderNewForm);
router.post("/search", isloggedIn,(req,res)=>{
  res.send("working");
});
// show ,update and delete
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isloggedIn,
    isOwner,
    upload.single('listing[image]'),//req.file me multer data layega
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .delete(isloggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;



