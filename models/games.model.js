const db = require("../db/connection");

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