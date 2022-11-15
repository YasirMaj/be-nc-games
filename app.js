const express = require("express");
const {
  catchAll,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const { getCategories, getReviews } = require("./controllers/games.controller");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL!" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(catchAll);

module.exports = app;
