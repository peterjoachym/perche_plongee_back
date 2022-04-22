const { connection } = require("../../db-connection");

class Price {
  static findManyPrices() {
    const sql = "SELECT * FROM price";
    return connection.promise().query(sql);
  }

  static findOnePriceById(id) {
    const sql = "SELECT * FROM price WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOnePrice(price) {
    const sql = "INSERT INTO price SET ?";
    return connection.promise().query(sql, [price]);
  }

  static async findPriceByClubEventId(club_event_id) {
    const sql = "SELECT * FROM price WHERE club_event_id=?";
    return connection.promise().query(sql, [club_event_id]);
  }

  static updateOnePriceById(price, id) {
    const sql = "UPDATE price SET ? WHERE id=?";
    return connection.promise().query(sql, [price, id]);
  }

  static async idDoNotExists(id) {
    const sql = "SELECT * FROM price WHERE id=?";
    const [result] = await connection.promise().query(sql, [id]);
    return result.length === 0;
  }

  static deleteOnePriceById(id) {
    const sql = "DELETE FROM price WHERE id=?";
    return connection.promise().query(sql, [id]);
  }
}

module.exports = Price;
