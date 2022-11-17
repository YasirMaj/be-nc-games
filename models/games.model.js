const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");
const { checkExists } = require("../db/seeds/utils");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
  });
};

exports.selectReviews = (
  sort_by = "reviews.created_at",
  order = "desc",
  category
) => {
  const validColumns = [
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "reviews.created_at",
    "reviews.votes",
    "comment_count",
  ];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Query!" });
  }

  const validOrder = ["asc", "desc"];

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order Query!" });
  }

  let queryStr = `
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
  ON reviews.review_id = comments.review_id`;

  const queryValues = [];

  if (category) {
    return checkExists("categories", "slug", category)
      .then(() => {
        queryValues.push(category);
        queryStr += ` WHERE category = $1 
                      GROUP BY reviews.review_id 
                      ORDER BY ${sort_by} ${order};`;
        return db.query(queryStr, queryValues);
      })
      .then((reviews) => reviews.rows);
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;
  return db.query(queryStr, queryValues).then((reviews) => reviews.rows);
};

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `
    SELECT 
    reviews.*, 
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;
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

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING*;", [
      comment_id,
    ])
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: "Comment Does Not Exist!" });
      }
    });
};
