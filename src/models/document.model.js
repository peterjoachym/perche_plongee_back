const { connection } = require("../../db-connection");

class Document {
  static async getManyDocuments(doc_type) {
    let sql = "SELECT * FROM document ORDER BY doc_name DESC";
    if (doc_type) {
      sql = "SELECT * FROM document WHERE doc_type=? ORDER BY doc_name DESC";
    }
    return connection.promise().query(sql, [doc_type]);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM document WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static async idDoNotExists(id) {
    const sql = "SELECT * FROM document WHERE id=?";
    const [result] = await connection.promise().query(sql, [id]);
    return result.length === 0;
  }

  static createOneDocument(document) {
    const sql = "INSERT INTO document SET ?";
    return connection.promise().query(sql, [document]);
  }

  static deleteOneDocumentById(id) {
    const sql = "DELETE FROM document WHERE id=?";
    connection.promise().query(sql, [id]);
  }
}

module.exports = Document;
