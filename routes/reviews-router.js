const {
  getReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewID,
  postComment,
  postReview,
  deleteReviewByID,
} = require("../controllers/games.controller");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewById)
  .delete(deleteReviewByID);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewID)
  .post(postComment);

module.exports = reviewsRouter;
