
import { useState, useEffect } from 'react';
import axios from 'axios';

export function Announcements() {
  const [anuncios, setAnuncios] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reload, setReload] = useState(false);

  const userId = localStorage.getItem('user_id');
  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    axios.get('/api/announcements')
      .then(res => setAnuncios(res.data))
      .catch(err => console.error(err));
  }, [reload]);

  const crearAnuncio = async () => {
    if (!title || !content) return alert('Completa todos los campos');

    try {
      await axios.post('/api/announcements', {
        title,
        content,
        created_by: userId
      });
      setTitle('');
      setContent('');
      setReload(!reload);
    } catch (err) {
      console.error(err);
      alert('Error al crear el anuncio');
    }
  };

  const eliminarAnuncio = async (id) => {
    if (!window.confirm('¿Eliminar este anuncio?')) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      setReload(!reload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Tablón de Anuncios</h2>

      {(userRole === 'docente' || userRole === 'admin') && (
        <div>
          <h3>Nuevo Anuncio</h3>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título"
          />
          <br />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Contenido"
          />
          <br />
          <button onClick={crearAnuncio}>Publicar</button>
        </div>
      )}

      <ul>
        {anuncios.map(anuncio => (
          <li key={anuncio.id}>
            <h4>{anuncio.title}</h4>
            <p>{anuncio.content}</p>
            <p><em>Publicado por: {anuncio.first_name} {anuncio.last_name1} - {new Date(anuncio.created_at).toLocaleString()}</em></p>
            {anuncio.created_by == userId && (
              <button onClick={() => eliminarAnuncio(anuncio.id)}>Eliminar</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
