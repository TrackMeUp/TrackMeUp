import React from 'react';

export function ChatItem({ avatar, nombre, fecha, activo }) { 
    return (
        <button 
            className={`chat-item ${activo ? 'chat-item-activo' : ''}`}
        >
            <img className="avatar" src="frontend\src\assets\1.png" alt="avatar" />
            <div className="chat-info">
                <div className="chat-nombre">{nombre}</div>
                <div className="chat-fecha">{new Date(fecha).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</div>
            </div>
        </button>
    );
}
