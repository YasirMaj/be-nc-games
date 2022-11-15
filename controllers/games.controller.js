const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReviewID,
} = require("../models/games.model");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewID(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
