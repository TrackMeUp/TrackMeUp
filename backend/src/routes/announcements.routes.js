
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los anuncios
router.get('/', async (req, res) => {
  const [rows] = await db.query(
    \`SELECT a.*, u.first_name, u.last_name1 
     FROM announcements a 
     JOIN user u ON a.created_by = u.user_id 
     ORDER BY created_at DESC\`
  );
  res.json(rows);
});

// Crear un nuevo anuncio
router.post('/', async (req, res) => {
  const { title, content, created_by } = req.body;
  if (!title || !content || !created_by) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  await db.query('INSERT INTO announcements (title, content, created_by) VALUES (?, ?, ?)', [title, content, created_by]);
  res.status(201).json({ message: 'Anuncio creado' });
});

// Eliminar un anuncio
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
  res.json({ message: 'Anuncio eliminado' });
});

module.exports = router;
