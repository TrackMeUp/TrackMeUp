import pool from "../db/connection.js";

class Profile {
  static async getByUserId(userId) {
    const [rows] = await pool.execute(

    `SELECT 
        s.student_id,
        su.first_name AS student_first_name,
        su.last_name1 AS student_last_name1,
        su.last_name2 AS student_last_name2,
        su.email AS student_email,
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
}

export default Profile;