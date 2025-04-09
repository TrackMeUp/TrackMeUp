import Message from '../models/message.js';

class MessageController {
    static obtenerConversaciones = async (req, res) => {
        const idUsuario = parseInt(req.params.id);
      
        if (isNaN(idUsuario)) {
          return res.status(400).json({ error: 'ID de usuario inválido' });
        }
      
        try {
          const conversaciones = await Message.getConversacionesUsuario(idUsuario);
          res.json(conversaciones);
        } catch (error) {
          console.error('Error al obtener mensajes:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      };
}

export default MessageController;