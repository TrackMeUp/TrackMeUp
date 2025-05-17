import pool from "../db/connection.js";

class Actividad {
  static async getActividadesPorEstudiante(studentId) {
    const [rows] = await pool.execute(
      `SELECT 
        s.submission_id,
        s.status,
        s.start_date AS submission_start,
        s.submission_date,
        s.grade,
        s.content AS student_content,
        s.student_comment,
        s.teacher_comment,
        a.activity_id,
        a.title,
        a.content AS activity_content,
        a.start_date AS activity_start,
        a.end_date,
        a.type,
        a.subject_id
      FROM submission s
      JOIN activity a ON s.activity_id = a.activity_id
      WHERE s.student_id = ?
      ORDER BY a.start_date DESC;`,
      [studentId]
    );

    return rows;
  }

  static async actualizarEstado(submissionId, nuevoEstado) {
    const [result] = await pool.execute(
      `UPDATE submission SET status = ? WHERE submission_id = ?`,
      [nuevoEstado, submissionId]
    );
    return result;
  }
}

export default Actividad;
