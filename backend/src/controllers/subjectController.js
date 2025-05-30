import Subject from "../models/subject.js";

class SubjectController {
  static async getDistinctSubjectNames(req, res) {
    const teacherId = parseInt(req.params.teacherId, 10);
    if (isNaN(teacherId)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    try {
      const subjectNames = await Subject.getDistinctSubjectNames(teacherId);
      res.json(subjectNames);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error al obtener asignaturas" });
    }
  }

  static async getGroupsBySubjectAndTeacher(req, res) {
    const teacherId = parseInt(req.params.teacherId, 10);
    const subjectName = decodeURIComponent(req.params.subjectName);

    if (isNaN(teacherId) || !subjectName) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }

    try {
      const groups = await Subject.getGroupsBySubjectAndTeacher(teacherId, subjectName);
      res.json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error al obtener grupos" });
    }
  }
}

export default SubjectController;
