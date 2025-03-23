const express = require("express");
const cors = require("cors");
const pool = require("../config/db");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
  express.json(),
);

app.get("/api", (req, res) => {
  res.json({ message: "👌" });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({status: "healthy", database: "connected"});
  } catch (error) {
    console.error("Health check failed.", error);
    res.status(503).json({status: "unhealthy", database: "disconnected"});
  }
});

app.get("/api/docente/:id", async (req, res) => {
  try {
    const idDocente = req.params.id;
    
    const [datosDocente] = await pool.query(`
      SELECT d.id_docente, u.nombre, u.apellido_1, u.apellido_2, u.email
      FROM docente d
      JOIN usuario u ON d.id_usuario = u.id_usuario
      WHERE d.id_docente = ?
    `, [idDocente]);
    
    if (datosDocente.length === 0) {
      return res.status(404).json({ error: "Error" });
    }
    
    const [asignaturas] = await pool.query(`
      SELECT a.id_asignatura, a.nombre, a.grupo,
             c.nombre as curso_nombre,
             COUNT(ea.id_estudiante) as numero_estudiantes
      FROM asignatura a
      JOIN curso c ON a.id_curso = c.id_curso
      LEFT JOIN estudiante_asignatura ea ON a.id_asignatura = ea.id_asignatura
      WHERE a.id_docente = ?
      GROUP BY a.id_asignatura
      ORDER BY c.nombre, a.nombre
    `, [idDocente]);
    
    const [actividades] = await pool.query(`
      SELECT a.id_actividad, a.titulo, a.tipo, a.fecha_inicio, a.fecha_fin,
             asig.nombre as asignatura_nombre
      FROM actividad a
      JOIN asignatura asig ON a.id_asignatura = asig.id_asignatura
      WHERE asig.id_docente = ?
      ORDER BY a.fecha_inicio
      LIMIT 10
    `, [idDocente]);
    
    res.json({
      docente: datosDocente[0],
      asignaturas: asignaturas,
      actividades: actividades
    });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.listen(3000, () => {
  console.log("Port: 3000");
});
