import pool from "../db/connection.js";

class Announcements {

  // Método para obtener las entradas del tablón (bulletin board entries)

  // Para usuarios con rol "Estudiante"
  static async getStudentAnnouncements(userId) {
    console.log("userId: " + userId );
    const [rows] = await pool.execute(
      
      `SELECT 
        bbe.title AS entry_title,
        bbe.content AS entry_content,
        s.name AS entry_subject,
        CONCAT(u.first_name, ' ', u.last_name1, ' ', u.last_name2) AS entry_teacher
      FROM bulletin_board_entry bbe
      JOIN subject s ON bbe.subject_id = s.subject_id
      JOIN teacher t ON s.teacher_id = t.teacher_id
      JOIN user u ON t.user_id = u.user_id
      JOIN student_subject ss ON ss.subject_id = s.subject_id
      WHERE ss.student_id = ?
      
    `, [userId]);
    console.log("rows: " + rows );
    return rows;
  }

  // Para usuarios con rol "Profesor"
  static async getTeacherAnnouncements(userId) {
    const [rows] = await pool.execute(

      `SELECT 
        bbe.title AS entry_title,
        bbe.content AS entry_content,
        s.name AS entry_subject,
        CONCAT(u.first_name, ' ', u.last_name1, ' ', u.last_name2) AS entry_teacher
      FROM bulletin_board_entry bbe
      JOIN subject s ON bbe.subject_id = s.subject_id
      JOIN teacher t ON s.teacher_id = t.teacher_id
      JOIN user u ON t.user_id = u.user_id
      WHERE t.teacher_id = ?

    `, [userId]);

    return rows;
  }

}

export default Announcements;