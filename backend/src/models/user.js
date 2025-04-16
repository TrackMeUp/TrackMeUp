import pool from "../db/connection.js";

class User {
  static async create(userData) {
    const [result] = await pool.execute(
      "INSERT INTO user (first_name, last_name1, last_name2, email, password) VALUES (?, ?, ?, ?, ?)",
      [
        userData.first_name,
        userData.last_name1,
        userData.last_name2,
        userData.email,
        userData.password,
      ],
    );

    const userId = result.insertId;

    switch (userData.role) {
      case "student":
        await pool.execute("INSERT INTO student (user_id) VALUES (?)", [
          userId,
        ]);
        break;
      case "teacher":
        await pool.execute("INSERT INTO teacher (user_id) VALUES (?)", [
          userId,
        ]);
        break;
      case "admin":
        await pool.execute(
          "INSERT INTO admin (user_id, access_level) VALUES (?, ?)",
          [userId, userData.access_level],
        );
        break;
      case "parent":
        await pool.execute(
          "INSERT INTO parent (user_id, student_id) VALUES (?, ?)",
          [userId, userData.parent_student_id],
        );
        break;
      default:
        // TODO: error
        break;
    }

    return { insertId: userId };
  }

  static async update(userId, userData) {
    let query =
      "UPDATE user SET first_name = ?, last_name1 = ?, last_name2 = ?, email = ?";
    let params = [
      userData.first_name,
      userData.last_name1,
      userData.last_name2,
      userData.email,
    ];

    if (userData.password) {
      query += ", password = ?";
      params.push(userData.password);
    }

    query += " WHERE user_id = ?";
    params.push(userId);

    const [result] = await pool.execute(query, params);

    // TODO: Update role

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM user WHERE user_id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }

  static async getById(id) {
    const [users] = await pool.execute("SELECT * FROM user WHERE user_id = ?", [
      id,
    ]);

    const user = users[0];
    if (!user) return null;

    const roleData = await this._getRoleData(id);

    return { ...user, ...roleData };
  }

  static async getByEmail(email) {
    const [users] = await pool.execute("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    const user = users[0];
    if (!user) return null;

    const roleData = await this._getRoleData(user.user_id);

    return { ...user, ...roleData };
  }

  static async getAll() {
    const [users] = await pool.query(
      "SELECT user_id, first_name, last_name1, last_name2, email FROM user",
    );

    if (!users.length) return null;

    const roles = await Promise.all(
      users.map((user) => this._getRoleData(user.user_id)),
    );

    users.forEach((user, i) => {
      user.role = roles[i].role;
    });

    return users;
  }

  static async _getRoleData(id) {
    const roleQueries = [
      "SELECT 'student' as name, student_id FROM student WHERE user_id = ?",
      "SELECT 'teacher' as name, teacher_id FROM teacher WHERE user_id = ?",
      "SELECT 'admin' as name, admin_id, access_level FROM admin WHERE user_id = ?",
      "SELECT 'parent' as name, parent_id, student_id FROM parent WHERE user_id = ?",
    ];

    for (const query of roleQueries) {
      const [role] = await pool.execute(query, [id]);

      if (role.length > 0) {
        return { role: role[0] };
      }
    }

    return { role: null };
  }
}

export default User;
