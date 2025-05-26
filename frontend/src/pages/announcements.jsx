import React, { useEffect, useState } from "react";
import "../styles/announcements.css"; // Crea este archivo para personalizar estilos

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  // Simulación de datos
  useEffect(() => {
    const dummyData = [
      {
        entry_id: 1,
        title: "Examen de matemáticas",
        content: "El examen se realizará el próximo lunes a las 9:00h.",
        attachment_url: null,
      },
      {
        entry_id: 2,
        title: "Tarea de historia",
        content: "Entrega obligatoria antes del viernes.",
        attachment_url: "https://example.com/tarea_historia.pdf",
      },
      {
        entry_id: 3,
        title: "Taller de programación",
        content: "Inscríbete en el taller de esta semana.",
        attachment_url: null,
      },
    ];

    setAnnouncements(dummyData);
  }, []);

  return (
    <div className="announcements-container">
      <h1 className="announcements-title">📌 Tablón de Anuncios</h1>
      {error && <p className="error">{error}</p>}

      {announcements.length === 0 ? (
        <p>No hay anuncios disponibles.</p>
      ) : (
        <ul className="announcements-list">
          {announcements.map((a) => (
            <li key={a.entry_id} className="announcement-card">
              <h3>{a.title}</h3>
              <p>{a.content}</p>
              {a.attachment_url && (
                <a
                  href={a.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="announcement-link"
                >
                  📎 Ver adjunto
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcements;