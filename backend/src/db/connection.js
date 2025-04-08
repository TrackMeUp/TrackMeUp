import mysql from "mysql2/promise";
import "dotenv/config";

// Copiar archivo backend/.env.example a backend/.env
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "tmu",
  password: process.env.MYSQL_PASSWORD || "user_password",
  database: process.env.MYSQL_DATABASE || "tmu",
  waitForConnections: true,
});

export default pool;
