import express from "express";
import MessageController from "../controllers/messageController.js";

const router = express.Router();

router.get("/get_mensajes/:id", (req, res) =>
  MessageController.obtenerConversaciones(req, res),
);

export default router;
