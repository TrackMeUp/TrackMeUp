import pool from "../db/connection.js";

class Actividad {
  static async getActividadesPorEstudiante(studentId) {
    const [rows] = await pool.execute(
      `SELECT 
        s.submission_id,
        s.status,
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
        a.subject_id,
        subj.name AS subject_name,
        u.first_name,
        u.last_name1,
        u.last_name2,
        u.user_id
      FROM submission s
      JOIN activity a ON s.activity_id = a.activity_id
      JOIN subject subj ON a.subject_id = subj.subject_id
      JOIN student st ON s.student_id = st.student_id
      JOIN user u ON st.user_id = u.user_id
      WHERE s.student_id = ?
      ORDER BY a.start_date DESC;`,
      [studentId]
    );
  
    return rows;
  }

  static async getActivitiesWithSubmissionsByTeacher(teacherId) {
    const [rows] = await pool.execute(
      `SELECT 
      s.submission_id,
      s.status,
      s.grade,
      s.student_comment,
      s.teacher_comment,
      s.submission_date,
      s.start_date,
      a.end_date,
      a.content AS activity_content,
      a.title,
      subj.name AS subject_name,
      u.first_name,
      u.last_name1,
      u.last_name2
    FROM submission s
    JOIN activity a ON s.activity_id = a.activity_id
    JOIN subject subj ON a.subject_id = subj.subject_id
    JOIN student st ON s.student_id = st.student_id
    JOIN user u ON st.user_id = u.user_id
    WHERE subj.teacher_id = ?
    ORDER BY a.start_date DESC;
    
    `,
      [teacherId]
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

  static async actualizarComentarioEstudiante(submissionId, studentComment) {
    const [result] = await pool.execute(
      `UPDATE submission SET student_comment = ? WHERE submission_id = ?`,
      [studentComment, submissionId]
    );
    return result;
  }
  
  static async corregirActividad(submissionId, grade, teacherComment) {
    const [result] = await pool.execute(
      `UPDATE submission SET grade = ?, teacher_comment = ? WHERE submission_id = ?`,
      [grade, teacherComment, submissionId]
    );
    return result;
  }
  
}

export default Actividad;
