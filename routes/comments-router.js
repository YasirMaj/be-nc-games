const { deleteCommentByID } = require("../controllers/games.controller");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentByID)

module.exports = commentsRouter