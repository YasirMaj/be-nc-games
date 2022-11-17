const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReviewID,
  insertComment,
  updateReviewById,
  selectUsers,
  removeCommentById,
} = require("../models/games.model");
const endpoints = require("../endpoints.json")

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  selectReviews(sort_by, order, category)
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

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  if (!username || !body) {
    res.status(400).send({ msg: "Missing Input Data!" });
  } else {
    insertComment(review_id, username, body)
      .then((addedComment) => {
        res.status(201).send({ comment: addedComment });
      })
      .catch(next);
  }
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  if (!inc_votes) {
    res.status(400).send({ msg: "Missing Input Data!" });
  } else {
    updateReviewById(review_id, inc_votes)
      .then((updatedReview) => {
        res.status(200).send({ review: updatedReview });
      })
      .catch(next);
  }
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
      res.status(200).send({endpoints});
};