const { connection } = require("../../db-connection");

class Picture {
  static findManyPictures() {
    const sql = "SELECT * FROM picture";
    return connection.promise().query(sql);
  }

  static findOnePictureById(id) {
    const sql = "SELECT * FROM picture WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static async findAvatarByUserId(user_id) {
    const sql = "SELECT * FROM picture WHERE user_id=?";
    return connection.promise().query(sql, [user_id]);
  }

  static async findPictureByClubEventId(club_event_id) {
    const sql = "SELECT * FROM picture WHERE club_event_id=?";
    return connection.promise().query(sql, [club_event_id]);
  }

  static async UserIdDoExist(user_id) {
    const sql = "SELECT * FROM picture WHERE user_id=?";
    const [result] = await connection.promise().query(sql, [user_id]);
    return result.length > 0;
  }

  static createOnePicture(picture) {
    const sql = "INSERT INTO picture SET ?";
    return connection.promise().query(sql, [picture]);
  }

  static updateOnePictureById(picture, id) {
    const sql = "UPDATE picture SET ? WHERE id=?";
    return connection.promise().query(sql, [picture, id]);
  }

  static async idDoNotExists(id) {
    const sql = "SELECT * FROM picture WHERE id=?";
    const [result] = await connection.promise().query(sql, [id]);
    return result.length === 0;
  }

  static deleteOnePictureById(id) {
    const sql = "DELETE FROM picture WHERE id=?";
    connection.promise().query(sql, [id]);
  }

  static async findEventPictureByEventId(event_id) {
    const sql = "SELECT * FROM picture WHERE event_id=?";
    return connection.promise().query(sql, [event_id]);
  }

  static async eventIdExists(event_id) {
    const sql = "SELECT * FROM picture WHERE event_id=?";
    const [result] = await connection.promise().query(sql, [event_id]);
    return result.length > 0;
  }
}

module.exports = Picture;
