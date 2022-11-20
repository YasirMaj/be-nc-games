const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReviewID,
  insertComment,
  updateReviewById,
  selectUsers,
  removeCommentById,
  selectUserByUsername,
  updateCommentById,
  insertReview,
  insertCategory,
  removeReviewById,
  insertUser,
} = require("../models/games.model");
const endpoints = require("../endpoints.json");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category, limit, p } = req.query;
  selectReviews(sort_by, order, category, limit, p)
    .then(({ reviews, total_count }) => {
      res.status(200).send({ reviews, total_count });
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
  const { limit, p } = req.query;
  selectCommentsByReviewID(review_id, limit, p)
    .then(({ comments, total_count }) => {
      res.status(200).send({ comments, total_count });
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
  res.status(200).send({ endpoints });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  if (!inc_votes) {
    res.status(400).send({ msg: "Missing Input Data!" });
  } else {
    updateCommentById(comment_id, inc_votes)
      .then((updatedComment) => {
        res.status(200).send({ comment: updatedComment });
      })
      .catch(next);
  }
};

exports.postReview = (req, res, next) => {
  const { owner, title, review_body, designer, category } = req.body;
  if (!owner || !title || !review_body || !designer || !category) {
    res.status(400).send({ msg: "Missing Input Data!" });
  } else {
    insertReview(owner, title, review_body, designer, category)
      .then((addedReview) => {
        res.status(201).send({ review: addedReview });
      })
      .catch(next);
  }
};

exports.postCategory = (req, res, next) => {
  const { slug, description } = req.body;
  if (!slug || !description) {
    res.status(400).send({ msg: "Missing Input Data!" });
  } else {
    insertCategory(slug, description)
      .then((addedCategory) => {
        res.status(201).send({ category: addedCategory });
      })
      .catch(next);
  }
};

exports.deleteReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  removeReviewById(review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  if (!username || !name || !avatar_url) {
    res.status(400).send({ msg: "Missing Input Data!" });
  } else {
    insertUser(username, name, avatar_url)
      .then((addedUser) => {
        res.status(201).send({ user: addedUser });
      })
      .catch(next);
  }
};
