const {
  getCategories,
  postCategory,
} = require("../controllers/games.controller");

const categoriesRouter = require("express").Router();

categoriesRouter.route("/").get(getCategories).post(postCategory);

module.exports = categoriesRouter;
