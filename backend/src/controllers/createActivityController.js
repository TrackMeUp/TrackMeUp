import createActivity from "../models/createActivity.js"; // o donde tengas la clase lógica

class CreateActivityController {
  static async createActivity(req, res) {
    try {
      console.log("==> Petición recibida:", req.body);
  
      const {
        subject_id,
        title,
        content,
        start_date,
        end_date,
        type,
        submission_date,
      } = req.body;
  
      console.log("==> Datos extraídos:", {
        subject_id,
        title,
        content,
        start_date,
        end_date,
        type,
        submission_date,
      });
  
      const result = await createActivity.createActivity(
        subject_id,
        title,
        content,
        start_date,
        end_date,
        type,
        submission_date
      );
  
      console.log("==> Resultado:", result);
  
      res.status(201).json({ message: "Actividad creada", data: result });
    } catch (error) {
      console.error("Error al crear actividad:", error);
      res.status(500).json({
        message: "Error al crear la actividad",
        error: error.message,
      });
    }
  }
  
}

export default CreateActivityController;
