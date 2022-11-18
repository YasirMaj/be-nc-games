const apiRouter = require("express").Router();
const categoriesRouter = require("./categories-router");
const reviewsRouter = require("./reviews-router");
const userRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const { getEndpoints } = require("../controllers/games.controller");

apiRouter.get("/", getEndpoints);

apiRouter.get("/health", (req,res) => {
  res.status(200).send({msg: 'server up and running...'})
})

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/comments", commentsRouter)

module.exports = apiRouter;
