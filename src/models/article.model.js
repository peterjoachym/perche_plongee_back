const { connection } = require("../../db-connection");

class Article {
  static findArticle() {
    const sql = "SELECT * FROM article";
    return connection.promise().query(sql);
  }

  static deleteAllArticles() {
    const sql = "TRUNCATE TABLE article";
    return connection.promise().query(sql);
  }

  static createOneArticle(article) {
    const sql = "INSERT INTO article SET ?";
    return connection.promise().query(sql, [article]);
  }
}

module.exports = Article;
