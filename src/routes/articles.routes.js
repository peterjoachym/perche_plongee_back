const articleRouter = require("express").Router();
const { articleController } = require("../controllers");

articleRouter.get("/", articleController.getArticle);
articleRouter.post("/", articleController.deleteAllArticles, articleController.createArticle, articleController.getArticle);

module.exports = articleRouter;
