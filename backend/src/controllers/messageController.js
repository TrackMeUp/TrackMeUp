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

  static async createMessage(req, res) {
    try {
      const { authorId, recipientId, content } = req.body;

      if (!authorId || !recipientId || !content) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }

      const result = await Message.createMessage(authorId, recipientId, content);

      res.status(201).json({
        success: true,
        message: "Message created successfully",
        data: result
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error creating message",
        error: err.message
      });
    }
  };

}

export default MessageController;
