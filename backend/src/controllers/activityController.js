import pool from "../db/connection.js";
import Actividad from "../models/activity.js";

class ActividadController {
  static async obtenerActividades(req, res) {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ error: "ID inválido" });

    try {
      const [studentResult] = await pool.execute(
        "SELECT student_id FROM student WHERE user_id = ?",
        [userId]
      );

      if (studentResult.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }

      const studentId = studentResult[0].student_id;
      const actividades = await Actividad.getActividadesPorEstudiante(studentId);
      res.status(200).json(actividades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener actividades del estudiante" });
    }
  }

  static async obtenerActividadesProfesor(req, res) {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ error: "ID inválido" });

    try {
      const [teacherResult] = await pool.execute(
        "SELECT teacher_id FROM teacher WHERE user_id = ?",
        [userId]
      );

      if (teacherResult.length === 0) {
        return res.status(404).json({ error: "Profesor no encontrado" });
      }

      const teacherId = teacherResult[0].teacher_id;
      const actividades = await Actividad.getActivitiesWithSubmissionsByTeacher(teacherId);
      res.status(200).json(actividades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener actividades del profesor" });
    }
  }

  static async actualizarEstado(req, res) {
    const { submissionId, nuevoEstado } = req.body;

    if (!submissionId || !nuevoEstado)
      return res.status(400).json({ error: "Faltan campos requeridos" });

    try {
      const result = await Actividad.actualizarEstado(submissionId, nuevoEstado);
      res.status(200).json({ success: true, updated: result.affectedRows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar estado" });
    }
  }

  static async actualizarComentarioEstudiante(req, res) {
    const { submissionId, studentComment } = req.body;
  
    if (!submissionId || studentComment === undefined) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
  
    try {
      const result = await Actividad.actualizarComentarioEstudiante(submissionId, studentComment);
      res.status(200).json({ success: true, updated: result.affectedRows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el comentario del estudiante" });
    }
  }
  
  static async corregirActividad(req, res) {
    const { submissionId, grade, teacherComment } = req.body;
  
    if (!submissionId || grade === undefined) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
  
    try {
      const result = await Actividad.corregirActividad(submissionId, grade, teacherComment);
      res.status(200).json({ success: true, updated: result.affectedRows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al corregir la actividad" });
    }
  }
  
}

export default ActividadController;
