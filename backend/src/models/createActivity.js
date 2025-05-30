import pool from "../db/connection.js";

class createActivity {
  // Función principal: inserta actividad y genera submissions
  static async createActivity(subject_id, title, content, start_date, end_date, type, submission_date) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `INSERT INTO activity (subject_id, title, content, start_date, end_date, type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [subject_id, title, content, start_date, end_date, type]
      );

      const activity_id = result.insertId;

      const [students] = await connection.execute(
        `SELECT student_id FROM student_subject WHERE subject_id = ?`,
        [subject_id]
      );
      console.log(`Alumnos para subject_id ${subject_id}:`, students);

      if (students.length === 0) {
        throw new Error(`No students found for subject_id ${subject_id}`);
      }

      const insertValues = students.map(s => [
        s.student_id,
        activity_id,
        null,          
        content,
        null,          
        null,          
        submission_date,
        'pending',
        start_date,
      ]);

      await connection.query(
        `INSERT INTO submission 
         (student_id, activity_id, grade, content, student_comment, teacher_comment, submission_date, status, start_date)
         VALUES ?`,
        [insertValues]
      );

      await connection.commit();

      return { success: true, activity_id, submissionsCreated: students.length };

    } catch (error) {
      await connection.rollback();
      console.error("Error en createActivity:", error.message);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default createActivity;
