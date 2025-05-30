import Announcements from "../models/announcements.js";

class AnnouncementsController {
  static async obtenerTablonAnuncios(req, res) {

    const userId = parseInt(req.params.id);
    const rol = req.params.rol;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "El ID de ususario no es válido" });
    }


    try {

      let announcement;

      switch (rol) {
        case "student":
          announcement = await Announcements.getStudentAnnouncements(userId);
          break;
        case "parent":
          announcement = await Announcements.getStudentAnnouncements(userId);
          break;
        case "teacher":
          announcement = await Announcements.getTeacherAnnouncements(userId);
          break;
        default:
          throw new Error("Rol no válido");
      }

      if (!announcement) {
        return res.status(400).json({ error: "No se ha podido encontrar el tablón de anuncios" });
      }

      res.status(200).json(announcement);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el tablón de anuncios" });
    }
    
  }

  static async createAnnouncement(req, res) {
    try {
      const { subject_id, title, content, attachment_url } = req.body;

      if (!subject_id || !title || !content) {
        return res.status(400).json({
          success: false,
          message: "Subject ID, title, and content are required"
        });
      }

      const result = await Announcements.createAnnouncement({
        subject_id,
        title,
        content,
        attachment_url
      });

      return res.status(201).json({
        success: true,
        message: "Announcement created successfully",
        entry_id: result.insertId
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Could not create announcement",
        error: err.message
      });
    }
  }
}

export default AnnouncementsController;
