const { Article } = require("../models");

const getArticle = async (req, res) => {
  try {
    const [results] = await Article.findArticle();
    res.json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createArticle = async (req, res, next) => {
  const { title, content } = req.body;
  try {
    await Article.createOneArticle({ title, content });
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteAllArticles = async (req, res, next) => {
  try {
    await Article.deleteAllArticles();
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getArticle,
  deleteAllArticles,
  createArticle,
};
