const express = require("express");
const {
  catchAll,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const { getCategories } = require("./controllers/games.controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL!" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(catchAll);

module.exports = app;
