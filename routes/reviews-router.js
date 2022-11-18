const {
  getReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewID,
  postComment,
  postReview,
} = require("../controllers/games.controller");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewID)
  .post(postComment);

module.exports = reviewsRouter;
