const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.catagoryListing = async (req, res) => {
  let { btnValue } = req.body;
  const allListings = await Listing.find({ catagory: btnValue });
  res.render("listings/catagory.ejs", { allListings, btnValue });
};

module.exports.searchResult = async (req, res) => {
  let { search } = req.body;
  const allListings = await Listing.find({
    "$or": [
      { "title": { $regex: search } },
      { "catagory": { $regex: search } },
      { "country": { $regex: search, $options: "i" } },
    ]
  });
  let btnValue = search;
  console.log(search);
  console.log(allListings);
  res.render("listings/catagory.ejs", { allListings, btnValue });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }
    
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
