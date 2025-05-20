import pool from "../db/connection.js";

class Profile {

  // Vista para el rol "Estudiante"
  static async getStudentProfile(userId) {

    const [rows] = await pool.execute(

      `SELECT 
        s.student_id,
        su.user_id AS student_user_id,
        su.first_name AS student_first_name,
        su.last_name1 AS student_last_name1,
        su.last_name2 AS student_last_name2,
        su.email AS student_email,
        pu.user_id AS parent_user_id,
        pu.first_name AS parent_first_name,
        pu.last_name1 AS parent_last_name1,
        pu.last_name2 AS parent_last_name2,
        pu.email AS parent_email
      FROM student s
      JOIN user su ON s.user_id = su.user_id
      LEFT JOIN parent p ON p.student_id = s.student_id
      LEFT JOIN user pu ON p.user_id = pu.user_id
      WHERE s.user_id = ?
      `,
      [userId]
    );

    if (rows.length === 0) return null;

    const student = {

      user_id: rows[0].student_user_id,
      first_name: rows[0].student_first_name,
      last_name1: rows[0].student_last_name1,
      last_name2: rows[0].student_last_name2,
      email: rows[0].student_email,

      parents: rows.filter(row => row.parent_user_id != null).map(row => ({
        user_id: row.parent_user_id,
        first_name: row.parent_first_name,
        last_name1: row.parent_last_name1,
        last_name2: row.parent_last_name2,
        email: row.parent_email,
      })),

    };

    return student;
  }

  // Vista para el rol "Padre"
  static async getParentProfile(userId) {

    const [rows] = await pool.execute(
      `SELECT 
        p.parent_id,
        pu.user_id AS parent_user_id,
        pu.first_name AS parent_first_name,
        pu.last_name1 AS parent_last_name1,
        pu.last_name2 AS parent_last_name2,
        pu.email AS parent_email,
        s.student_id,
        su.user_id AS student_user_id,
        su.first_name AS student_first_name,
        su.last_name1 AS student_last_name1,
        su.last_name2 AS student_last_name2,
        su.email AS student_email
      FROM parent p
      JOIN user pu ON p.user_id = pu.user_id
      JOIN student s ON p.student_id = s.student_id
      JOIN user su ON s.user_id = su.user_id
      WHERE p.user_id = ?
      `,
      [userId]
    );


    if (rows.length === 0) return null;

    const parent = {

      user_id: rows[0].parent_user_id,
      first_name: rows[0].parent_first_name,
      last_name1: rows[0].parent_last_name1,
      last_name2: rows[0].parent_last_name2,
      email: rows[0].parent_email,

      students: rows.filter(row => row.student_user_id != null).map(row => ({
        user_id: row.student_user_id,
        first_name: row.student_first_name,
        last_name1: row.student_last_name1,
        last_name2: row.student_last_name2,
        email: row.student_email,
      })),

    };

    return parent;
  }

  // Vista para el rol "Personal docente"
  static async getTeacherProfile(userId) {

    const [rows] = await pool.execute(
      `SELECT 
        t.teacher_id,
        tu.user_id AS teacher_user_id,
        tu.first_name AS teacher_first_name,
        tu.last_name1 AS teacher_last_name1,
        tu.last_name2 AS teacher_last_name2,
        tu.email AS teacher_email
      FROM teacher t
      JOIN user tu ON t.user_id = tu.user_id
      WHERE t.user_id = ?
      `,
      [userId]
    );


    if (rows.length === 0) return null;

    const teacher = {

      user_id: rows[0].teacher_user_id,
      first_name: rows[0].teacher_first_name,
      last_name1: rows[0].teacher_last_name1,
      last_name2: rows[0].teacher_last_name2,
      email: rows[0].teacher_email

    };

    return teacher;

  }


}

export default Profile;