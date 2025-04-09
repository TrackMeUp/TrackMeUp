import pool from "../db/connection.js";

class Message {
  static async getConversacionesUsuario(idUsuario) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM mensaje WHERE id_usuario_autor = ?"
        ,[idUsuario],
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }
}

export default Message;