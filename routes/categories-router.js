const { getCategories } = require("../controllers/games.controller");

const categoriesRouter = require("express").Router();

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
