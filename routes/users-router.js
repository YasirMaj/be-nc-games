const {
  getUsers,
  getUserByUsername,
  postUser,
} = require("../controllers/games.controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers).post(postUser);

userRouter.route("/:username").get(getUserByUsername);

module.exports = userRouter;
