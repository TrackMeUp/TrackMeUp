import pool from "../db/connection.js";

class HealthController {
  async checkHealth(req, res) {
    try {
      // Prueba la conexión con la base de datos.
      await pool.query("SELECT 1");

      res.status(200).json({
        status: "healthy",
        database: "connected",
      });
    } catch (err) {
      console.error("Health check failed.", err);
      res.status(503).json({
        status: "unhealthy",
        database: "disconnected",
        error: err.message,
      });
    }
  }
}

export default new HealthController();
