const mainRouter = require("express").Router();
const usersRouter = require("./users.routes");
const authRouter = require("./auth.routes");
const eventsRouter = require("./events.routes");
const picturesRouter = require("./pictures.routes");
const pricesRouter = require("./prices.routes");
const articleRouter = require("./articles.routes");
const documentRouter = require("./documents.routes");

mainRouter.use("/users", usersRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/events", eventsRouter);
mainRouter.use("/pictures", picturesRouter);
mainRouter.use("/prices", pricesRouter);
mainRouter.use("/articles", articleRouter);
mainRouter.use("/documents", documentRouter);

module.exports = mainRouter;
