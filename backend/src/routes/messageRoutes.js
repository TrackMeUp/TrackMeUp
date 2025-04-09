import express from 'express';
import MessageController from '../controllers/messageController.js';

const router = express.Router();

router.get('/mensajes/:id', MessageController.obtenerConversaciones);

export default router;
