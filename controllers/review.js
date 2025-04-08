const Listing=require("../models/listing")
const Review=require("../models/review")


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
  }

  module.exports.destryReview=async (req, res) => {
    let { id, reviewId } = req.params;
  
    // Remove review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
    // Delete the actual review from the database
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","New Review Deleted!");
    res.redirect(`/listings/${id}`);
  }