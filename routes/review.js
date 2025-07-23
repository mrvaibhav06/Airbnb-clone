const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const Listing = require("../models/listings.js");
const reviewController =require("../controllers/reviews.js")
const review = require("../models/review.js");

// POST route - Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE route - Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
