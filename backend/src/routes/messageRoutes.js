import express from "express";
import MessageController from "../controllers/messageController.js";

const router = express.Router();

router.get("/get_conversaciones/:id", (req, res) =>
  MessageController.obtenerConversaciones(req, res),
);

router.get("/get_mensajes/:id1/:id2", (req, res) =>
  MessageController.obtenerMensajesEntreUsuarios(req, res),
);

router.post("/send", 
  MessageController.createMessage
);

export default router;
