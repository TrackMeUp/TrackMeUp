import express from "express";
import ActividadController from "../controllers/activityController.js";

const router = express.Router();

router.get("/estudiante/:id", ActividadController.obtenerActividades);
router.put("/actualizar_estado", ActividadController.actualizarEstado);

export default router;
