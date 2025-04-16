import Message from "../models/message.js";

class MessageController {
  static obtenerConversaciones = async (req, res) => {
    const idUsuario = parseInt(req.params.id);

    if (isNaN(idUsuario)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    try {
      const conversaciones = await Message.getConversacionesUsuario(idUsuario);

      return res.status(200).json(conversaciones);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static obtenerMensajesEntreUsuarios = async (req, res) => {
    const { id1, id2 } = req.params;

    if (isNaN(id1) || isNaN(id2)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    try {
      const mensajes = await Message.getMensajesEntreDosUsuarios(id1, id2);
      
      return res.status(200).json(mensajes);
    } catch (error) {
      console.error("Error al obtener mensajes entre usuarios:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

}

export default MessageController;
