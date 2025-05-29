import express from 'express';
import { getAnnouncements, postAnnouncement } from '../controllers/announcementsController.js';

const router = express.Router();

// Middleware de autenticación simulado (deberías reemplazarlo con uno real)
const mockAuth = (req, res, next) => {
    req.user = { user_id: 1, role: 'profesor' }; // Simulación de profesor autenticado
    next();
};

router.use(mockAuth);

router.get('/', getAnnouncements);
router.post('/', postAnnouncement);

export default router;
