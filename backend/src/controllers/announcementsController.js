
const {
    getAllAnnouncements,
    createAnnouncement
} = require('../models/announcements');

const getAnnouncements = async (req, res) => {
    try {
        const announcements = await getAllAnnouncements();
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los anuncios' });
    }
};

const postAnnouncement = async (req, res) => {
    if (req.user?.role !== 'profesor') {
        return res.status(403).json({ message: 'Solo los profesores pueden publicar anuncios' });
    }

    const { title, content } = req.body;
    const userId = req.user.user_id;

    if (!title || !content) {
        return res.status(400).json({ message: 'Título y contenido son obligatorios' });
    }

    try {
        const newAnnouncement = await createAnnouncement(title, content, userId);
        res.status(201).json(newAnnouncement);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el anuncio' });
    }
};

module.exports = {
    getAnnouncements,
    postAnnouncement
};
