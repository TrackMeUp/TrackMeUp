import React from 'react';

export function Message({ entradas, usuarioId }) {
    return (
        <div className="mensajes">
            {entradas.map((mensaje) => (
                <div
                    key={mensaje.message_id}
                    className={`mensaje ${mensaje.author_user_id === usuarioId ? 'mensaje-true' : 'mensaje-false'}`}
                >
                    <img className="avatar" src={`/frontend/src/assets/${mensaje.author_user_id}.png`} alt="avatar" />
                    <div className={`mensaje-contenido ${mensaje.author_user_id === usuarioId ? 'mensaje-contenido-true' : 'mensaje-contenido-false'}`}>
                        <p className="mensaje-texto">{mensaje.content}</p>
                        <span className="mensaje-hora">{new Date(mensaje.date).toLocaleString()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
