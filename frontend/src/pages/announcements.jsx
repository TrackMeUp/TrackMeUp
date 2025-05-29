
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_TMU_API_URL || "http://localhost:3000/api";

export function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${API_URL}/announcements`);
                if (!response.ok) throw new Error("Error al obtener anuncios");
                const data = await response.json();
                setAnnouncements(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    if (loading) return <p>Cargando anuncios...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Tablón de Anuncios</h2>
            {announcements.length === 0 ? (
                <p>No hay anuncios disponibles.</p>
            ) : (
                <ul>
                    {announcements.map(anuncio => (
                        <li key={anuncio.id}>
                            <h3>{anuncio.title}</h3>
                            <p>{anuncio.content}</p>
                            <small>Publicado el {new Date(anuncio.created_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
