import Actividad from "../models/activity.js";

class ActividadController {
  static async obtenerActividades(req, res) {
    const studentId = parseInt(req.params.id);
    if (isNaN(studentId)) return res.status(400).json({ error: "ID inválido" });

    try {
      const actividades = await Actividad.getActividadesPorEstudiante(studentId);
      res.status(200).json(actividades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener actividades" });
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
}

export default ActividadController;
