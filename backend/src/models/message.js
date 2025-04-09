import pool from "../db/connection.js";

class Message {
  static async getConversacionesUsuario(idUsuario) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM message WHERE author_user_id = ?",
        [idUsuario],
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }
}

export default Message;
