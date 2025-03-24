const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config();

// Copiar archivo backend/.env.example a backend/.env
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "tmu",
    password: process.env.MYSQL_PASSWORD || "user_password",
    database: process.env.MYSQL_DATABASE || "tmu",
    waitForConnections: true,
});

module.exports = pool;
