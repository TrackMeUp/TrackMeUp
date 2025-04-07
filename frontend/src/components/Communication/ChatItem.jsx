import React from 'react';

export function ChatItem({ avatar, nombre, fecha, nuevo, activo }) {
    return (
        <button className={`chat-item ${activo ? 'chat-item-activo' : ''}`}>
            <img className="avatar" src={avatar} alt="avatar" />
            <div className="chat-info">
                <div className="chat-nombre">{nombre}</div>
                <div className="chat-fecha">{fecha}</div>
            </div>
            {nuevo && <div className="nuevo-indicador">2</div>}
        </button>
    );
}
