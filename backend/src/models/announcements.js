import pool from "../db/connection.js";

class Announcements {

    // Método para obtener las entradas del tablón (bulletin board entries)
    static async getBulletinBoardEntries() {

        const [rows] = await pool.execute(
            
    `SELECT
        b.title AS entry_title,
        b.content AS entry_content,
        b.attachment_url,
        s.name AS entry_subject,
        CONCAT(u.first_name, ' ', u.last_name1, ' ', u.last_name2) AS entry_teacher
      FROM bulletin_board_entry b
      JOIN subject s ON b.subject_id = s.subject_id
      JOIN teacher t ON s.teacher_id = t.teacher_id
      JOIN user u ON t.user_id = u.user_id
      
    `);

        if (rows.length === 0) return [];

        return rows;
    }

}

export default Announcements;