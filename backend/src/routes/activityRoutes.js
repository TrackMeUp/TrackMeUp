import express from "express";
import ActividadController from "../controllers/activityController.js";

const router = express.Router();


router.get("/estudiante/:id", ActividadController.obtenerActividades);
router.get("/profesor/:id", ActividadController.obtenerActividadesProfesor);
router.put("/actualizar_estado", ActividadController.actualizarEstado);
router.put("/comentario_estudiante", ActividadController.actualizarComentarioEstudiante);
router.put("/corregir", ActividadController.corregirActividad);


export default router;
