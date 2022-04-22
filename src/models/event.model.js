const { connection } = require("../../db-connection");

class Event {
  static findManyEvents() {
    const sql = "SELECT * FROM club_event ORDER BY event_date DESC";
    return connection.promise().query(sql);
  }

  static findManyPictures(is_public) {
    let sql = "SELECT * FROM picture";
    if (is_public === "true") {
      sql += " WHERE is_public=true";
    }
    return connection.promise().query(sql, [is_public]);
  }

  static findManyPrices(is_public) {
    let sql = "SELECT * FROM price";
    if (is_public === "true") {
      sql += " WHERE is_public=true";
    }
    return connection.promise().query(sql, [is_public]);
  }

  static findOneEventById(id) {
    const sql = "SELECT * FROM club_event WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOneEvent(event) {
    const sql = "INSERT INTO club_event SET ?";
    return connection.promise().query(sql, [event]);
  }

  static updateOneEventById(event, id) {
    const sql = "UPDATE club_event SET ? WHERE id=?";
    return connection.promise().query(sql, [event, id]);
  }

  static async idDoNotExists(id) {
    const sql = "SELECT * FROM club_event WHERE id=?";
    const [result] = await connection.promise().query(sql, [id]);
    return result.length === 0;
  }

  static deleteOneEventById(id) {
    const sql = "DELETE FROM club_event WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static uploadPoster(event_poster) {
    const sql = "INSERT INTO club_event SET ?";
    return connection.promise().query(sql, [event_poster]);
  }
}

module.exports = Event;
