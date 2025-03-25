const pool = require("../db/connection");

class User {
    static async getByEmail(email) {
        try {
            const [rows] = await pool.execute(
                "SELECT * FROM usuario WHERE email = ?",
                [email],
            );

            return rows[0] || null;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = User;
