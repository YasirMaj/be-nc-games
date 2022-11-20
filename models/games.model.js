const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");
const endpoints = require("../endpoints.json");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
  });
};

exports.selectReviews = (
  sort_by = "reviews.created_at",
  order = "desc",
  category,
  limit = 10,
  p = 1
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

  if (!parseInt(limit)) {
    return Promise.reject({ status: 400, msg: "Invalid Limit Query!" });
  }

  if (!parseInt(p)) {
    return Promise.reject({ status: 400, msg: "Invalid Page Query!" });
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
  COUNT(comments.review_id):: INT AS comment_count,
  COUNT(*) OVER():: INT AS total_count
  FROM reviews
  LEFT JOIN comments 
  ON reviews.review_id = comments.review_id`;

  const queryValues = [];
  const offset = (parseInt(p) - 1) * parseInt(limit);

  if (category) {
    return checkExists("categories", "slug", category)
      .then(() => {
        queryValues.push(category);
        queryStr += ` WHERE category = $1 
                      GROUP BY reviews.review_id 
                      ORDER BY ${sort_by} ${order}
                      LIMIT ${limit} OFFSET ${offset};`;
        return db.query(queryStr, queryValues);
      })
      .then((res) => {
        const total_count = res.rows.length ? res.rows[0].total_count : 0;
        const reviews = res.rows.map((review) => {
          const newReview = { ...review };
          delete newReview.total_count;
          return newReview;
        });
        return { reviews, total_count };
      });
  }

  queryStr += ` 
  GROUP BY reviews.review_id 
  ORDER BY ${sort_by} ${order} 
  LIMIT ${limit} OFFSET ${offset};`;
  return db.query(queryStr, queryValues).then((res) => {
    const total_count = res.rows.length ? res.rows[0].total_count : 0;
    const reviews = res.rows.map((review) => {
      const newReview = { ...review };
      delete newReview.total_count;
      return newReview;
    });
    return { reviews, total_count };
  });
};

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `
    SELECT 
    reviews.*, 
    COUNT(comments.review_id):: INT AS comment_count
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

exports.selectCommentsByReviewID = (review_id, limit = 10, p = 1) => {
  return checkExists("reviews", "review_id", review_id).then(() => {
    if (!parseInt(limit)) {
      return Promise.reject({ status: 400, msg: "Invalid Limit Query!" });
    }

    if (!parseInt(p)) {
      return Promise.reject({ status: 400, msg: "Invalid Page Query!" });
    }

    const offset = (parseInt(p) - 1) * parseInt(limit);

    return db
      .query(
        `
      SELECT comments.*,
      COUNT(*) OVER()::INT as total_count
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;`,
        [review_id, limit, offset]
      )
      .then((res) => {
        const total_count = res.rows.length ? res.rows[0].total_count : 0;
        const comments = res.rows.map((comment) => {
          const newComment = { ...comment };
          delete newComment.total_count;
          return newComment;
        });
        return { comments, total_count };
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
      .then((review) => {
        return review.rows[0];
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

exports.selectUserByUsername = (username) => {
  return checkExists("users", "username", username).then(() => {
    return db
      .query("SELECT * FROM users WHERE username = $1;", [username])
      .then((user) => {
        return user.rows[0];
      });
  });
};

exports.updateCommentById = (comment_id, votes) => {
  return checkExists("comments", "comment_id", comment_id).then(() => {
    return db
      .query(
        `UPDATE comments
          SET votes = votes + $2
          WHERE comment_id = $1
          RETURNING *;`,
        [comment_id, votes]
      )
      .then((comment) => {
        return comment.rows[0];
      });
  });
};

exports.insertReview = (owner, title, review_body, designer, category) => {
  return checkExists("categories", "slug", category).then(() => {
    return checkExists("users", "username", owner).then(() => {
      return db
        .query(
          `
        INSERT INTO reviews
        (owner, title, review_body, designer, category)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
          [owner, title, review_body, designer, category]
        )
        .then((review) => {
          review.rows[0].comment_count = "0";
          return review.rows[0];
        });
    });
  });
};

exports.insertCategory = (slug, description) => {
    return db
      .query(
        `
        INSERT INTO categories
        (slug, description)
        VALUES
        ($1, $2)
        RETURNING *;`,
        [slug, description]
      )
      .then((category) => {
        return category.rows[0];
      });
};
