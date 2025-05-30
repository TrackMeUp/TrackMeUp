import pool from "../db/connection.js";

class Subject {
  static async getDistinctSubjectNames(teacherId) {
    const [rows] = await pool.execute(
      `SELECT DISTINCT name FROM subject WHERE teacher_id = ?`,
      [teacherId]
    );
    return rows;
  }

  static async getGroupsBySubjectAndTeacher(teacherId, subjectName) {
    const [rows] = await pool.execute(
      `SELECT s.subject_id, CONCAT(c.name, ' ', s.class_group) AS course_and_group
       FROM subject s
       JOIN course c ON s.course_id = c.course_id
       WHERE s.teacher_id = ? AND s.name = ?`,
      [teacherId, subjectName]
    );
    return rows;
  }
}

export default Subject;
