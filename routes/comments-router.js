const {
  deleteCommentByID,
  patchCommentById,
} = require("../controllers/games.controller");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentByID)
  .patch(patchCommentById);

module.exports = commentsRouter;
