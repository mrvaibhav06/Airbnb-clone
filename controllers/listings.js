const Listing = require("../models/listings");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    if (!req.file) {
      req.flash("error", "Image upload failed or was not provided.");
      return res.redirect("/listings/new");
    }
    const { path: url, filename } = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err); // Pass to error handler middleware
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("success", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing ,originalImageUrl });
};
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Update basic listing details
  Object.assign(listing, req.body.listing);

  // Handle image upload if a new image is provided
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};


// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;

//   const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   if (typeof req.file !=="undefinde") {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//   }

//   req.flash("success", "Listing updated successfully!");
//   res.redirect(`/listings/${id}`);
// };

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
