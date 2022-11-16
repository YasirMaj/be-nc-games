const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");
const { checkExists } = require("../db/seeds/utils");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `
  SELECT 
  title,
  category, 
  designer,
  owner, 
  review_body, 
  review_img_url, 
  reviews.created_at, 
  reviews.votes,
  COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments 
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;
  `
    )
    .then((reviews) => {
      return reviews.rows;
    });
};

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM reviews
    WHERE review_id = $1;
  `,
      [review_id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: "ID not Found!" });
      }
      return res.rows[0];
    });
};

exports.selectCommentsByReviewID = (review_id) => {
  return checkExists("reviews", "review_id", review_id).then(() => {
    return db
      .query(
        `
      SELECT * FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC;
    `,
        [review_id]
      )
      .then((res) => {
        return res.rows;
      });
  });
};

exports.insertComment = (review_id, author, body) => {
  return checkExists("reviews", "review_id", review_id).then(() => {
    return checkExists("users", "username", author).then(() => {
      return db
        .query(
          `
        INSERT INTO comments
        (review_id, author, body)
        VALUES
        ($1, $2, $3)
        RETURNING *;
        `,
          [review_id, author, body]
        )
        .then((res) => {
          return res.rows[0];
        });
    });
  });
};

exports.updateReviewById = (review_id, votes) => {
  return checkExists("reviews", "review_id", review_id).then(() => {
    return db
      .query(
        `UPDATE reviews
          SET votes = votes + $2
          WHERE review_id = $1
          RETURNING *;`,
        [review_id, votes]
      )
      .then((res) => {
        return res.rows[0];
      });
  });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => {
    return users.rows;
  });
};
