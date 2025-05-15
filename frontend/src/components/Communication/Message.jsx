import React, { useEffect, useRef } from 'react';

export function Message({ entradas, usuarioId }) {
    const mensajesEndRef = useRef(null);

    useEffect(() => {
        if (mensajesEndRef.current) {
            mensajesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [entradas]);

    return (
        <div className="mensajes">
            {entradas.map((mensaje) => (
                <div
                    key={mensaje.message_id}
                    className={`mensaje ${mensaje.author_user_id === usuarioId ? 'mensaje-true' : 'mensaje-false'}`}
                >
                    <img className="avatar" src={`../../../public/${mensaje.author_user_id}.png`} alt="avatar" />
                    <div className={`mensaje-contenido ${mensaje.author_user_id === usuarioId ? 'mensaje-contenido-true' : 'mensaje-contenido-false'}`}>
                        <p className="mensaje-texto">{mensaje.content}</p>
                        <span className="mensaje-hora">
                                {new Date(mensaje.date).toLocaleTimeString([], {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                            })}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={mensajesEndRef} />
        </div>
    );
}
