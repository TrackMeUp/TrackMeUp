import React from 'react';

export function ChatItem({ avatar, nombre, fecha, nuevo }) {
    return (
        <button className="chat-item">
            <img className="avatar" src={avatar} alt="avatar" />
            <div className="chat-info">
                <div className="chat-nombre">{nombre}</div>
                <div className="chat-fecha">{fecha}</div>
            </div>
        </button>
    );
}
