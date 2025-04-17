import pool from "../db/connection.js";

class Message {
  static async getConversacionesUsuario(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          CASE 
              WHEN m.author_user_id = ? THEN CONCAT(u2.first_name, ' ', u2.last_name1, ' ', u2.last_name2)
              ELSE CONCAT(u1.first_name, ' ', u1.last_name1, ' ', u1.last_name2)
          END AS persona_conversa,
          CASE 
              WHEN m.author_user_id = ? THEN u2.user_id
              ELSE u1.user_id
          END AS id_persona_conversa,
          MAX(m.date) AS fecha_ultimo_mensaje
        FROM 
          message m
        JOIN user u1 ON u1.user_id = m.author_user_id
        JOIN user u2 ON u2.user_id = m.recipient_user_id
        WHERE 
          m.author_user_id = ? OR m.recipient_user_id = ?
        GROUP BY persona_conversa, id_persona_conversa
        ORDER BY fecha_ultimo_mensaje DESC;`,
      [id, id, id, id]
      );
  
      return rows;
    } catch (err) {
      throw err;
    }
  }
  

  static async getMensajesEntreDosUsuarios(idUsuario1, idUsuario2) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
            m.message_id,
            m.author_user_id,
            m.recipient_user_id,
            m.date,
            m.content,
            CASE 
                WHEN m.author_user_id = ? THEN CONCAT(u1.first_name, ' ', u1.last_name1, ' ', u1.last_name2)
                ELSE CONCAT(u2.first_name, ' ', u2.last_name1, ' ', u2.last_name2)
            END AS author_name,
            CASE 
                WHEN m.recipient_user_id = ? THEN CONCAT(u1.first_name, ' ', u1.last_name1, ' ', u1.last_name2)
                ELSE CONCAT(u2.first_name, ' ', u2.last_name1, ' ', u2.last_name2)
            END AS recipient_name
        FROM 
            message m
        JOIN user u1 ON u1.user_id = m.author_user_id
        JOIN user u2 ON u2.user_id = m.recipient_user_id
        WHERE 
            (m.author_user_id = ? AND m.recipient_user_id = ?)
            OR (m.author_user_id = ? AND m.recipient_user_id = ?)
        ORDER BY m.date;`,
        [idUsuario1, idUsuario2, idUsuario1, idUsuario2, idUsuario2, idUsuario1]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async createMessage(authorId, recipientId, content) {
    try {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
  
      const [result] = await pool.execute(
        `INSERT INTO message (author_user_id, recipient_user_id, date, content) VALUES (?, ?, ?, ?)`,
        [authorId, recipientId, formattedDate, content]
      );
  
      return {
        success: true,
        messageId: result.insertId,
        date: formattedDate
      };
    } catch (err) {
      throw err;
    }
  }  

}

export default Message;
