const express = require("express");
const {
  catchAll,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewID,
  postComment,
  patchReviewById,
  getUsers,
  deleteCommentByID,
} = require("./controllers/games.controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL!" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(catchAll);

module.exports = app;
