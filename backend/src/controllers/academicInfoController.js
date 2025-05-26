import AcademicInfo from "../models/academic_info.js";

class AcademicInfoController {
  static async obtenerInformacionAcademica(req, res) {

    const userId = parseInt(req.params.id);
    const rol = req.params.rol;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "El ID de ususario no es válido" });
    }


    try {

      let infoAcademica;

      switch (rol) {
        case "student":
          infoAcademica = await AcademicInfo.getStudentAcademicInfo(userId);
          break;
        case "parent":
          infoAcademica = await AcademicInfo.getParentAcademicInfo(userId);
          break;
        case "teacher":
          infoAcademica = await AcademicInfo.getTeacherAcademicInfo(userId);
          break;
        default:
          throw new Error("Rol no válido");
      }

      if (!infoAcademica) {
        return res.status(400).json({ error: "No se ha podido encontrar la información académica" });
      }

      res.status(200).json(infoAcademica);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener la información académica" });
    }
    
  }
}

export default AcademicInfoController;